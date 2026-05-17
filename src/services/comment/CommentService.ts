// src/services/comment/CommentService.ts
import { PrismaClient } from "@prisma/client";
import { imageBufferToFormat } from "../../utils"; // ◄— Importamos a função utilitária

const prisma = new PrismaClient();

interface ICreateComment {
  content: string;
  authorId: string;
  articleId: string;
}

interface IUpdateComment {
  id: string;
  userId: string;
  content: string;
}

export class CommentService {
  // 1. CRIAR COMENTÁRIO
  async createComment({ content, authorId, articleId }: ICreateComment) {
    if (!content || !content.trim()) {
      throw new Error("O conteúdo do comentário não pode estar vazio.");
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        authorId,
        articleId,
      },
      include: {
        author: {
          select: {
            name: true,
            profileImg: true,
          },
        },
      },
    });

    // ◄— CORREÇÃO: Formata a imagem do autor para Base64 antes de devolver ao Front
    const formattedComment = {
      ...newComment,
      author: {
        ...newComment.author,
        profileImg: imageBufferToFormat(newComment.author.profileImg),
      },
    };

    return {
      message: "Comentário publicado com sucesso!",
      comment: formattedComment, // Devolve o comentário já perfeitamente formatado
    };
  }

  // 2. EDITAR COMENTÁRIO
  async updateComment({ id, userId, content }: IUpdateComment) {
    if (!content || !content.trim()) {
      throw new Error("O conteúdo do comentário não pode estar vazio.");
    }

    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new Error("Comentário não encontrado.");
    }

    if (comment.authorId !== userId) {
      throw new Error(
        "Acesso negado: Você só pode editar os seus próprios comentários.",
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
      // ◄— CORREÇÃO: Traz o autor na edição também para não perder a foto no estado do Front!
      include: {
        author: {
          select: { name: true, profileImg: true },
        },
      },
    });

    // ◄— CORREÇÃO: Formata a imagem do autor para Base64
    const formattedComment = {
      ...updatedComment,
      author: {
        ...updatedComment.author,
        profileImg: imageBufferToFormat(updatedComment.author.profileImg),
      },
    };

    return {
      message: "Comentário atualizado com sucesso!",
      comment: formattedComment,
    };
  }

  // 3. DELETAR COMENTÁRIO
  async deleteComment(id: string, userId: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new Error("Comentário não encontrado.");
    }

    if (comment.authorId !== userId) {
      throw new Error(
        "Acesso negado: Você só pode excluir os seus próprios comentários.",
      );
    }

    await prisma.comment.delete({ where: { id } });

    return {
      message: "Comentário removido com sucesso!",
    };
  }
}
