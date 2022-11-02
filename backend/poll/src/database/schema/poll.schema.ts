import { object, string, TypeOf } from "zod";

export const PollSchema = object({
    body: object({
      adminId:string({
        required_error: "Admin Id is required"
      }),
      theaterId:string({
        required_error: "Theater Id is required"
      }),
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
      }).optional(),
      vote: string({
        required_error: "Vote is required"
      }).optional()
    })
  })

export type PollInput = TypeOf<typeof PollSchema>;