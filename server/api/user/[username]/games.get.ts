import { PrismaClient, PrivacySetting } from "@prisma/client";
import { User } from "@supabase/supabase-js";

const prisma = new PrismaClient();

export default defineEventHandler(async (handler) => {
  const me: User | null = handler.context.user;
  const username = handler.context.params?.username as string;

  const user = await prisma.userSettings.findUnique({
    where: {
      username,
    },
    select: {
      user_id: true,
      privacy: true,
      friends: {
        select: {
          user_id: true,
        },
      },
    },
  });

  if (!user) {
    console.error(`User not found: ${username}`);
    throw createError({
      status: 404,
      statusMessage: "Not Found",
    });
  }

  const games = await prisma.game.findMany({
    where: {
      deleted: false,
      user_id: user?.user_id,
      OR: [
        // PUBLIC PROFILE
        // PUBLIC GAME
        {
          user: {
            privacy: PrivacySetting.PUBLIC,
          },
          privacy: PrivacySetting.PUBLIC,
        },
        // PRIVATE GAME
        // This is an indirect lookup for a given user, so we need
        // to make sure that the user can see the games.
        {
          user: {
            privacy: PrivacySetting.PUBLIC,
            OR: [
              {
                user_id: me?.id || "",
              },
              {
                friends: {
                  some: {
                    user_id: me?.id || "",
                  },
                },
              },
            ],
          },
          privacy: PrivacySetting.PRIVATE,
        },
        // FRIENDS ONLY GAME
        {
          user: {
            privacy: PrivacySetting.PUBLIC,
            OR: [
              {
                friends: {
                  some: {
                    user_id: me?.id || "",
                  },
                },
              },
              {
                user_id: me?.id || "",
              },
            ],
          },
          privacy: PrivacySetting.FRIENDS_ONLY,
        },
        // PRIVATE PROFILE
        // PUBLIC GAME
        // No filtering done here, because the game is public.
        // We'll need to anonymize the user's profile, though.
        {
          user: {
            privacy: PrivacySetting.PRIVATE,
          },
          privacy: PrivacySetting.PUBLIC,
        },
        // PRIVATE GAME
        // This is an indirect lookup for a given user, so we need
        // to make sure that the user can see the games.
        {
          user: {
            privacy: PrivacySetting.PRIVATE,
            OR: [
              {
                user_id: me?.id || "",
              },
              {
                friends: {
                  some: {
                    user_id: me?.id || "",
                  },
                },
              },
            ],
          },
          privacy: PrivacySetting.PRIVATE,
        },
        // FRIENDS ONLY GAME
        {
          user: {
            privacy: PrivacySetting.PRIVATE,
            OR: [
              {
                friends: {
                  some: {
                    user_id: me?.id || "",
                  },
                },
              },
              {
                user_id: me?.id || "",
              },
            ],
          },
          privacy: PrivacySetting.FRIENDS_ONLY,
        },
        // FRIENDS ONLY PROFILE
        // PUBLIC GAME
        // We're just treating this as a friends only game, because
        // we don't want to show the user's profile.
        {
          user: {
            privacy: PrivacySetting.FRIENDS_ONLY,
            OR: [
              {
                user_id: me?.id || "",
              },
              {
                friends: {
                  some: {
                    user_id: me?.id || "",
                  },
                },
              },
            ],
          },
          privacy: PrivacySetting.PUBLIC,
        },
        // PRIVATE GAME
        // Direct links are allowed, so we aren't performing any checks on the user
        {
          user: {
            privacy: PrivacySetting.FRIENDS_ONLY,
            OR: [
              {
                user_id: me?.id || "",
              },
              {
                friends: {
                  some: {
                    user_id: me?.id || "",
                  },
                },
              },
            ],
          },
          privacy: PrivacySetting.PRIVATE,
        },
        // FRIENDS ONLY GAME
        {
          user: {
            privacy: PrivacySetting.FRIENDS_ONLY,
            OR: [
              {
                friends: {
                  some: {
                    user_id: me?.id || "",
                  },
                },
              },
              {
                user_id: me?.id || "",
              },
            ],
          },
          privacy: PrivacySetting.FRIENDS_ONLY,
        },
      ],
    },
    include: {
      user: {
        select: {
          privacy: true,
          username: true,
        },
      },
      player_characters: {
        include: {
          role: {
            select: {
              token_url: true,
              type: true,
              initial_alignment: true,
            },
          },
          related_role: {
            select: {
              token_url: true,
            },
          },
        },
      },
      grimoire: {
        include: {
          tokens: {
            include: {
              role: true,
              related_role: true,
            },
          },
        },
      },
      parent_game: {
        select: {
          user: {
            select: {
              username: true,
              display_name: true,
            },
          },
        },
      },
    },
  });

  return games;
});
