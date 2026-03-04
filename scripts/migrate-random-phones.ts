import "dotenv/config"
import prisma from '../src/lib/prisma'

async function main() {
    console.log('Fetching members...')
    const members = await prisma.user.findMany({
        where: { role: 'MEMBER' }
    })

    console.log(`Found ${members.length} members. Assigning random phone numbers...`)

    for (const member of members) {
        // Generate a random 10-digit Indian-style phone number starting with 9, 8, or 7
        const prefix = ['7', '8', '9'][Math.floor(Math.random() * 3)]
        const rest = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')
        const randomPhone = prefix + rest

        await prisma.user.update({
            where: { id: member.id },
            data: { phone: randomPhone }
        })
        console.log(`Updated ${member.name}: ${randomPhone}`)
    }

    console.log('All members updated successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
