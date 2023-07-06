import type { User } from "@supabase/supabase-js";
import { PrismaClient, game } from "@prisma/client";

export default defineEventHandler(async (handler) => {
  const user: User | null = handler.context.user;

  if (!user) {
    return {
      status: 401,
      body: {
        message: "Unauthorized",
      },
    };
  }

  const prisma = new PrismaClient();
  const games: game[] = await prisma.game.findMany({
    where: {
      user_id: user.id,
    },
  });
  return games;
});
