from kafka import KafkaProducer
import json
import os
import logging

logger = logging.getLogger(__name__)

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "articles_topic")

producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def send_article_to_kafka(articles):
    try:
        for article in articles:
            producer.send(KAFKA_TOPIC, article)
        producer.flush()
        logger.info(f"Sent {len(articles)} articles to Kafka topic {KAFKA_TOPIC}")
    except Exception as e:
        logger.error(f"Error sending to Kafka: {str(e)}")