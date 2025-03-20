import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();


const MONGODB_URI = process.env.DATABASE_URL || 'mongodb+srv://nhathuy2903:XKpqK9PlaV7BImPz@cluster0.vreiy66.mongodb.net/Newspaper_App';

async function deleteFutureArticles() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db();
        const articlesCollection = db.collection('Article');
        
        // Get current date
        const currentDate = new Date();
        
        // Find and delete articles with future publication dates
        const result = await articlesCollection.deleteMany({
            pubDate: { $gt: currentDate }
        });
        
        console.log(`Deleted ${result.deletedCount} articles with future publication dates`);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

// Run the function
deleteFutureArticles(); 