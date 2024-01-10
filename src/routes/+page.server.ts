export const actions = {
  default: async ({ locals }) => {
    await locals.R2.put("newvalue", "test");
  },
};
