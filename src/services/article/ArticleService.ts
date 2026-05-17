import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ArticleService {
  
  // FUNÇÃO AUXILIAR: Fica privada dentro da classe para ser usada pelos métodos
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .normalize('NFD') // Remove acentos
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/[\s_]+/g, '-') // Substitui espaços por hífens
      .replace(/^-+|-+$/g, ''); // Limpa hífens extras nas pontas
  }

  // 1. CRIAR ARTIGO
  async createArticle({ title, content, authorId, bannerBuffer }: any) {
    const slug = this.generateSlug(title);
    const excerpt = content ? content.substring(0, 120) + '...' : '';

    const newArticle = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        banner: bannerBuffer,
        authorId: Number(authorId),
      },
    });

    return { message: 'Artigo publicado com sucesso!', article: newArticle };
  }

  // 2. LISTAR TODOS OS ARTIGOS
  async getAllArticles() {
    const articles = await prisma.article.findMany({
      include: {
        author: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return articles;
  }

  // 3. BUSCAR UM ARTIGO POR SLUG E INCREMENTAR VISUALIZAÇÃO
  async getArticleBySlug(slug: string) {
    const article = await prisma.article.update({
      where: { slug: String(slug) },
      data: {
        views: { increment: 1 }
      },
      include: {
        author: { select: { name: true, avatarUrl: true } }
      }
    });

    return article;
  }

  // 4. LISTAR ARTIGOS DE UM USUÁRIO ESPECÍFICO
  async getArticlesByUserId(userId: number) {
    const articles = await prisma.article.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return articles;
  }

  // 5. BUSCAR UM ARTIGO POR ID
  async getArticleById(id: number) {
    const article = await prisma.article.findUnique({
      where: { id },
      include: { author: { select: { name: true } } },
    });

    if (!article) {
      throw new Error('Artigo não encontrado.');
    }

    return article;
  }

  // 6. EDITAR ARTIGO
  async updateArticle({ id, title, content, bannerBuffer }: any) {
    const dataUpdate: any = { title, content };
    
    // Atualiza também o slug e o resumo caso o título ou o texto mudem
    if (title) dataUpdate.slug = this.generateSlug(title);
    if (content) dataUpdate.excerpt = content.substring(0, 120) + '...';
    if (bannerBuffer) dataUpdate.banner = bannerBuffer;

    const updated = await prisma.article.update({
      where: { id },
      data: dataUpdate,
    });

    return { message: 'Artigo atualizado com sucesso!', article: updated };
  }

  // 7. DELETAR ARTIGO
  async deleteArticle(id: number) {
    await prisma.article.delete({
      where: { id },
    });

    return { message: 'Artigo removido com sucesso!' };
  }
}