import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb+srv://nhathuy2903:XKpqK9PlaV7BImPz@cluster0.vreiy66.mongodb.net/Newspaper_App';

async function deleteRecentArticles() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db();
        const articlesCollection = db.collection('Article');
        
        // Find the 10 most recent articles from 'Tuổi Trẻ'
        const recentArticles = await articlesCollection.find({
            source_id :"tuoitre"
        }).sort({ pubDate: -1 }).limit(10).toArray();

        // Extract the IDs of these articles
        const idsToDelete = recentArticles.map(article => article._id);

        // Delete the articles by their IDs
        const result = await articlesCollection.deleteMany({
            _id: { $in: idsToDelete }
        });
        
        console.log(`Deleted ${result.deletedCount} recent articles from 'Tuổi Trẻ'`);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

// Run the function
deleteRecentArticles(); 