import { db } from '~/server/utils/auth'
import { CategorySchema } from '~/schema/category.schema'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const validatedData = CategorySchema.parse(body)

    const category = await db.category.create({
        data: {
            name: validatedData.name,
            slug: validatedData.slug,
            image: validatedData.image,
            logo: validatedData.logo,
            platformName: validatedData.platformName,
        },
    })

    return category
})
