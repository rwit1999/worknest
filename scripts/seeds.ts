const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient()

const main = async()=>{
    try{
        await db.category.createMany({
            data: [
                { name: "Software Development" },
                { name: "Data Science" },
                { name: "Machine Learning" },
                { name: "Web Development" },
                { name: "Mobile App Development" },
                { name: "Cybersecurity" },
                { name: "Cloud Computing" },
                { name: "Artificial Intelligence" },
                { name: "Database Management" },
                { name: "DevOps" },
                { name: "User Experience (UX) Design" },
                { name: "User Interface (UI) Design" },
                { name: "Project Management" },
                { name: "Game Development" },
                { name: "Systems Analysis" },
                { name: "Networking" },
                { name: "Blockchain Technology" },
                { name: "Internet of Things (IoT)" },
                { name: "Embedded Systems" },
                { name: "Software Testing" },
                { name: "Data Engineering" }
            ]            
        })
        console.log('success');
        
    }catch(error){
        console.log(`Error on seeding the database categories:${error}`);
        
    }
}

main()