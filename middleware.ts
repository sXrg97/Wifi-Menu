import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // "/" will be accessible to all users
  publicRoutes: ["/", "/menu/:id", "/api/uploadthing"], //remove api/uploadthing
});
 
export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

//http://localhost:3000/menu/6529ec3e860bd70d0497199e