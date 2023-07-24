const { BlogCategory } = require("@prisma/client");
const { prisma } = require("../../prisma-instance");

async function seedBlogs() {
    const blogCategories = [
        BlogCategory.BACKEND,
        BlogCategory.FRONTEND,
        BlogCategory.MOBILE
    ]
    for (let i = 1; i <= 3; i++) {
        const writer = await prisma.user.create({
            data: {
                username: `Writer ${i}`,
                fullName: `The Writer ${i}`,
            }
        });

        for (let j = 1; j <= 3; j++) {
            await prisma.blogs.create({
                data: {
                    title: `The Blog Part ${j} by Writer ${i}`,
                    content: "This is some contents here.",
                    category: blogCategories[Math.floor(Math.random() * 3)],
                    writerId: writer.id
                }
            })
        }
    }
}


seedBlogs().then(() => {
    console.log("SEED DONE!");
})