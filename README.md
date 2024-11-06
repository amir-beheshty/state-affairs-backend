# Local Setup

1. Make sure you have [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) installed.

2. Use `npm` or [pnpm](https://pnpm.io/installation)
   - Note: this project is shipped with `pnpm-lock.yaml`.

Execute the following to setup and run the server:

```bash
nvm use # install required node-version if needed
pnpm i
pnpm dev
```

Server should be live here: http://localhost:3000

APIs can be accessed here: http://localhost:3000/api/v1/

## System Design Q&A

> News Aggregation: Describe in your README how you would aggregate news
articles from multiple sources. How would you handle deduplication, store
articles, and ensure fresh data?

- News aggregation: A background task in a separate server that consumes data from multiple resources and synchs them with our database. 
- Deduplication:
  - There are two possibilities:
    1. The content is similar but not exactly "duplicate" - meaning that the same news from different sources is reported slightly differently. In this case, deduplication is complicated. 
       1. For one, news sources can be bias although the news may be about the same event, the way it's reported and the details of the report could vary. We may want to include both of these sources and their summaries or we may want to score (rank) the accuracy. This is beyond the scope of this project and I am happy to discuss it more in person.
    2. The content is very similar and should be deduped.
       1. One simple solution is Hashing. Generate a hash of the article's title and content. The hash can be used as a unique identifier for the news article.
       2. Use trained LLM to obtain a similarity score. 
       3. Additionally, we can use entity matching such as people names, date, topic, and region. The entity matching can further help us prevent potential duplicate entries.
- Fresh Data synch:
  - There are few approaches here. For brevity I'm just going to write the one's that come to mind:
    1. Background task like a CRON job.
    2. Data stream to keep up to date with current events. Similar to the stock market apps.
- Storage:
  1. a nosql db like MongoDB is a good start, especially for a startup. 
  2. Elasticsearch should also be used for optimized searching. 
  3. Redis for in memory caching for quick access.

> Scalability: Discuss how the system could handle thousands of news articles
across multiple states and topics. Would you index the articles? What storage
strategies would you use?

1. Use Geospatial Indexes. This is a feature offered by MongoDB and ElasticSearch so we can stick to these aforementioned storage technologies.
2. The Redis cache should be updated to include the more popular/read news articles.
3. May need db partitioning.
4. Since this will also mean there's going to be lots of writes, we need to protect the server and the db with Rate Limiting and Throttling (API Gateway).

> Search Optimization: Consider how you would make searching through
potentially large datasets efficient.

- I touched on this above. Use Elasticsearch and caching to make searching efficient. May need to optimize with Geospatial indexes.
