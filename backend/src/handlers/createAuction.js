async function createAuction(event, context) {
    const body = JSON.parse(event.body);
    const timestamp = new Date().toISOString();
    const auction = {
        title: body.title,
        status: "OPEN",
        createdAt: timestamp,
    };
    return {
        statusCode: 201, // Resource created
        body: JSON.stringify({ auction }),
    };
}

export const handler = createAuction;
