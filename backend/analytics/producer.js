import { Kafka } from "kafkajs";

let producer;
let enabled = false;

const kafkaBroker = process.env.KAFKA_BROKER || "localhost:9092";

const kafka = new Kafka({
    clientId: "game-server",
    brokers: [kafkaBroker]
});

export async function initProducer(){
    try {
        producer = kafka.producer();
        await producer.connect();
        enabled = true;
    } catch (err) {
        enabled = false;
        console.error("Kafka producer failed to connect. Continuing without analytics.", err);
    }
}

export async function emitGameCompleted(event){
    if (!enabled) return;

    await producer.send({
        topic: "game-analytics",
        messages: [
            {value: JSON.stringify(event)}
        ]
    });
}