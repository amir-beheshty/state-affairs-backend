import sqlite3 from 'sqlite3';

// Drop existing database and create new one in memory
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      summary TEXT,
      state TEXT,
      topic TEXT,
      url TEXT,
      published_at DATETIME NOT NULL
    )
  `);

  // Seed db with sample data
  db.run(`
    INSERT INTO news (title, summary, state, topic, url, published_at)
    VALUES
      ('I Tried the iPhone 16''s New Visual Intelligence, and It Feels Like the Future', 'Apple''s upcoming Visual Intelligence tool, set to debut with the iPhone 16, allows users to point their phone at a storefront to instantly access details like hours, customer photos, and options to call or order without needing to unlock the phone or open apps. Currently available as a preview in the iOS 18.2 developer beta, this feature aims to simplify quick access to information. Though designed for developers, early testing shows it effectively pulls up location-based details but may require users to adapt to this new way of interacting with their phones.', 'CA', 'Technology', 'https://www.cnet.com/tech/mobile/i-tried-the-iphone-16s-new-visual-intelligence-and-it-feels-like-the-future/', '2024-01-15T14:30:00Z'),
      ('Israel Boasts Strategic Gains From Attack on Iran, But Quietly', 'The Israel Defense Forces (IDF) reported the death of five soldiers in southern Lebanon on Saturday, raising the total killed in that region to 32 since October 1. This comes amid an escalating conflict with Hezbollah, with Israel''s recent ground offensive in Lebanon aimed at Iran-backed Hezbollah forces. Since October 7, when Hamas attacked Israel, a total of 771 Israeli soldiers have died, including 360 in Gaza. Israel''s airstrikes in Lebanon have displaced over 1 million people and resulted in more than 1,800 deaths since mid-September, according to Lebanese officials.', 'NY', 'Politics', 'https://www.cnn.com/world/live-news/israel-iran-strikes-lebanon-gaza-war-10-27-24/index.html', '2024-01-15T14:30:00Z'),
      ('Exploring Google''s AI-Powered Shopping Experience', 'Google introduces an AI-powered shopping experience that personalizes product recommendations and displays real-time prices for online stores. The new shopping interface is rolling out for Android and iOS users in the US.', 'CA', 'Technology', 'https://www.google.com/shopping/ai-powered-experience', '2024-01-20T08:00:00Z'),
      ('Tesla''s New Autopilot Update Is A Game-Changer', 'Tesla releases a significant update to Autopilot, focusing on safety and precision, allowing cars to handle complex road conditions more effectively.', 'CA', 'Automotive', 'https://www.tesla.com/autopilot/update-2024', '2024-02-05T12:00:00Z'),
      ('SpaceX Plans Mars Missions for 2025', 'SpaceX reveals plans for its first manned mission to Mars by 2025, aiming to establish the foundation for a human colony.', 'CA', 'Space', 'https://www.spacex.com/mars-mission-2025', '2024-03-01T10:30:00Z'),
      ('Microsoft Unveils ChatGPT Integration in Office', 'Microsoft introduces ChatGPT integration into Word and Excel, enabling users to create documents and analyze data using conversational prompts.', 'WA', 'Technology', 'https://www.microsoft.com/en-us/office/chatgpt-integration', '2024-04-12T16:45:00Z'),
      ('Meta Launches Horizon Workrooms for Remote Teams', 'Meta expands its VR offering with Horizon Workrooms, designed to facilitate immersive remote meetings and collaboration.', 'CA', 'Technology', 'https://www.meta.com/workrooms', '2024-02-15T14:20:00Z'),
      ('Amazon Announces Drone Delivery for Prime Customers', 'Amazon starts rolling out drone deliveries for Prime customers in select cities, promising fast and contactless delivery.', 'TX', 'E-commerce', 'https://www.amazon.com/prime-drone-delivery', '2024-05-22T09:00:00Z'),
      ('Ford Introduces Electric F-150 Lightning', 'Ford unveils the F-150 Lightning, an electric version of its popular truck, featuring impressive torque and towing capacity.', 'MI', 'Automotive', 'https://www.ford.com/electric/f150-lightning', '2024-06-10T11:00:00Z'),
      ('Google Maps Adds Real-Time Translation for International Travelers', 'Google Maps adds a real-time translation feature to help travelers communicate in foreign languages with local businesses.', 'CA', 'Travel', 'https://www.google.com/maps/real-time-translation', '2024-06-18T15:00:00Z'),
      ('Apple Watch Gains Blood Glucose Monitoring Feature', 'Apple introduces a non-invasive blood glucose monitoring feature in the Apple Watch, allowing diabetic patients to track their glucose levels.', 'CA', 'Health', 'https://www.apple.com/watch/blood-glucose', '2024-07-14T10:15:00Z'),
      ('Netflix Testing AI-Generated Content Recommendations', 'Netflix is testing an AI-based recommendation system that tailors content suggestions to match viewer preferences more accurately.', 'CA', 'Entertainment', 'https://www.netflix.com/ai-recommendations', '2024-08-03T14:45:00Z'),
      ('Uber Expands Autonomous Car Fleet in San Francisco', 'Uber begins testing a new fleet of autonomous cars in San Francisco, aiming to reduce traffic and improve ride availability.', 'CA', 'Technology', 'https://www.uber.com/autonomous-cars-sf', '2024-09-12T11:30:00Z'),
      ('Samsung Galaxy S24 Brings Satellite Connectivity', 'Samsung Galaxy S24 introduces satellite connectivity, allowing users to send emergency messages without cellular networks.', 'CA', 'Mobile', 'https://www.samsung.com/galaxy-s24/satellite', '2024-09-20T17:00:00Z'),
      ('LinkedIn Launches Skill-Based Job Matching', 'LinkedIn rolls out a skill-based job matching feature that helps users find jobs more suited to their actual expertise and experience.', 'CA', 'Careers', 'https://www.linkedin.com/skill-based-job-matching', '2024-10-04T13:00:00Z'),
      ('NASA Unveils the Artemis Moon Base Plan', 'NASA shares details about the Artemis project, which includes a lunar base set to host astronauts for extended periods.', 'TX', 'Space', 'https://www.nasa.gov/artemis/moon-base', '2024-10-22T09:00:00Z'),
      ('BMW''s Concept EV Embraces Sustainable Materials', 'BMW reveals a concept EV made from recycled materials, emphasizing sustainability in automotive manufacturing.', 'DE', 'Automotive', 'https://www.bmw.com/sustainable-ev-concept', '2024-11-03T10:15:00Z'),
      ('Pinterest Introduces AI-Generated Mood Boards', 'Pinterest introduces an AI feature that generates mood boards based on a user''s favorite pins.', 'CA', 'Lifestyle', 'https://www.pinterest.com/ai-mood-boards', '2024-11-15T10:00:00Z'),
      ('Spotify Tests Personalized AI DJ Experience', 'Spotify experiments with an AI DJ that curates playlists based on user preferences and mood.', 'NY', 'Music', 'https://www.spotify.com/ai-dj', '2024-12-01T12:00:00Z'),
      ('Zoom Adds AI-Powered Meeting Summaries', 'Zoom launches an AI feature that provides summaries of meeting minutes, making it easier for participants to catch up.', 'CA', 'Technology', 'https://www.zoom.us/meeting-summaries', '2024-12-10T09:00:00Z'),
      ('Adobe Photoshop Now Supports Generative AI', 'Adobe adds generative AI tools to Photoshop, enabling users to create complex visuals with minimal input.', 'CA', 'Design', 'https://www.adobe.com/photoshop/generative-ai', '2024-12-15T11:30:00Z'),
      ('Starbucks Tests AI-Driven Coffee Recommendations', 'Starbucks is testing an AI system that suggests coffee preferences based on customer history and preferences.', 'WA', 'Food & Beverage', 'https://www.starbucks.com/ai-coffee', '2024-12-20T10:00:00Z'),
      ('Airbnb Launches AI-Enhanced Travel Planning Tool', 'Airbnb rolls out an AI tool to help users plan their trips, offering accommodation, activity, and dining suggestions.', 'CA', 'Travel', 'https://www.airbnb.com/ai-travel-planner', '2025-01-02T14:00:00Z'),
      ('Nike Debuts Customizable AI Shoe Design', 'Nike launches a feature that allows customers to design their own shoes using an AI-powered customization tool.', 'OR', 'Fashion', 'https://www.nike.com/ai-shoe-design', '2025-01-15T09:30:00Z'),
      ('Apple Music Introduces AI-Based Mood Playlists', 'Apple Music rolls out AI-generated playlists tailored to users'' moods, updated based on real-time listening habits.', 'CA', 'Music', 'https://www.apple.com/music/ai-mood-playlists', '2025-01-25T08:15:00Z'),
      ('Intel Launches Energy-Efficient Processor for AI Applications', 'Intel announces a new processor designed specifically for energy-efficient AI computations in data centers.', 'CA', 'Technology', 'https://www.intel.com/ai-processor', '2025-02-05T13:00:00Z'),
      ('Instagram Adds AI-Generated Captions for Posts', 'Instagram introduces an AI feature that suggests captions for posts based on image content, aiming to boost engagement.', 'CA', 'Social Media', 'https://www.instagram.com/ai-captions', '2025-02-20T15:45:00Z'),
      ('Uber Eats Tests Drone Delivery for Food Orders', 'Uber Eats expands its delivery options by testing drones to ensure faster deliveries in high-demand areas.', 'CA', 'Food & Beverage', 'https://www.ubereats.com/drone-delivery', '2025-03-10T10:00:00Z'),
      ('Ford Introduces AI-Based Maintenance Alerts', 'Ford integrates an AI system into its vehicles that alerts owners of potential maintenance needs before they arise.', 'MI', 'Automotive', 'https://www.ford.com/ai-maintenance', '2025-03-25T14:30:00Z'),
      ('Snapchat Adds AR Pet Filters', 'Snapchat introduces augmented reality filters designed specifically for pets, allowing users to add fun animations to their pet photos.', 'CA', 'Social Media', 'https://www.snapchat.com/pet-ar-filters', '2025-04-15T12:00:00Z'),
      ('NASA Plans to Test Nuclear-Powered Rockets for Mars Missions', 'NASA unveils plans to test nuclear-powered rockets, which could significantly reduce travel time to Mars.', 'TX', 'Space', 'https://www.nasa.gov/nuclear-rockets', '2025-04-30T11:30:00Z'),
      ('Adobe Illustrator Adds AI-Based Design Suggestions', 'Adobe updates Illustrator with AI-based design suggestions, helping artists explore alternative styles.', 'CA', 'Design', 'https://www.adobe.com/illustrator/ai-suggestions', '2025-05-05T10:00:00Z')
  `);
});

export default db;
