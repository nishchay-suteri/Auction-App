async function hello(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello from Auction Service" }),
    };
}

export const handler = hello;
