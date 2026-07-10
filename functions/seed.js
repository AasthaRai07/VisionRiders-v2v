const admin = require("firebase-admin");
const fs = require('fs');

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

admin.initializeApp({ projectId: 'hernova-13f01' });

const db = admin.firestore();

async function seedCourses() {
    try {
        const data = fs.readFileSync('c:\\Users\\ADMIN\\Downloads\\hernova_courses_seed.json', 'utf8');
        const seedData = JSON.parse(data);
        
        let courses = [];
        if (Array.isArray(seedData)) {
            courses = seedData;
        } else if (seedData.courses) {
            courses = seedData.courses;
        }

        console.log(`Found ${courses.length} courses to seed.`);

        const batch = db.batch();
        const coursesRef = db.collection('courses');

        courses.forEach(course => {
            const docRef = coursesRef.doc(); // Auto-generate ID if none provided
            batch.set(docRef, course);
        });

        await batch.commit();
        console.log("Successfully seeded courses to emulator!");
    } catch (e) {
        console.error("Failed to seed courses:", e);
    }
}

seedCourses();
