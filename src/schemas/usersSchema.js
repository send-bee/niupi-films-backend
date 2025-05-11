import z from "zod";

function sesionUsersSchema() {

  const registerFormSchema = z.object({
    name: z.string().min(3, { message: "Name is required" }),
    email: z.string().email(),
    password: z.string().min(8, { message: "Password is required and it must contain at least 8 characters" }).max(30)
  });
  const signInFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password is required" }).max(30)
  });

  const validateSignUpInput = (object) => {
    return registerFormSchema.safeParse(object)
  };
  const validateSignInInput = (object) => {
    return signInFormSchema.safeParse(object)
  };

  return {
    validateSignInInput,
    validateSignUpInput
  };
}

export default sesionUsersSchema
