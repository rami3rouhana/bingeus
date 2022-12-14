import { object, string, TypeOf } from "zod";

export const createTheaterSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    adminId: string(),
    showing: object({
      name: string({
        required_error: "Title is required",
      }),
      image: string({
        required_error: "Poster is required",
      }),
      description: string({
        required_error: "Description is required",
      })
    })
  })
})

export const createUserTheaterSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    uploadedFiles: object({
      name: string({
        required_error: "Title is required",
      }),
      url: string({
        required_error: "Title is required",
      }),
      image: string({
        required_error: "Poster is required",
      }),
      duration: string({
        required_error: "Description is required",
      }),
      description: string({
        required_error: "Description is required",
      })
    })
  })
})

export const editUserTheaterSchema = object({
  body: object({
    name: string().optional(),
    showing: object({
      title: string().optional(),
      poster: string().optional(),
      description: string().optional()
    }).optional()
  })
})



export const CreatePlaylistSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    video: string({
      required_error: "Video is required",
    }),
    description: string({
      required_error: "Description is required",
    })
  }),
  params: object({
    id: string().optional(),
    movieId: string().optional(),
    toId: string().optional(),
  }),
})

export const BlockSchema = object({
  params: object({
    id: string({
      required_error: "User is required",
    })
  })
})

export const TheaterSchema = object({
  params: object({
    id: string({
      required_error: "User is required",
    })
  })
})

export const PollSchema = object({
  body: object({
    title: string({
      required_error: "Title is required"
    }),
    options: object({
      name: string({
        required_error: "Title is required"
      })
    }).array(),
  }),
  params: object({
    id: string({
      required_error: "TheaterID is required"
    }),
    pollId: string({
      required_error: "VoteId is required"
    }).optional(),
    vote: string({
      required_error: "Vote is required"
    }).optional()
  })
})

export type CreateTheaterInput = TypeOf<typeof createTheaterSchema>;
export type CreateUserTheaterInput = TypeOf<typeof createUserTheaterSchema>;
export type CreatePlaylistInput = TypeOf<typeof CreatePlaylistSchema>;
export type BlockInput = TypeOf<typeof BlockSchema>;
export type GetTheater = TypeOf<typeof TheaterSchema>;
export type PollInput = TypeOf<typeof PollSchema>;


