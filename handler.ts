import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import {DynamoDBClient, GetItemCommand, PutItemCommand} from "@aws-sdk/client-dynamodb";

export const hello = async (event:any, _context:any): Promise<object>  => {
    console.log("Api handler............................",event)

    process.env.AWS_SECRET_ACCESS_KEY = 'test'
    process.env.AWS_ACCESS_KEY_ID = 'test'

    let params = {
        stateMachineArn: "arn:aws:states:us-east-1:000000000000:stateMachine:DemoServiceUserDetails",
        input: JSON.stringify({"name":"harsh"}),
        name: String((new Date()).getTime()),
    };

    //endpoint = LOCALSTACK_HOSTNAME + EDGE_PORT

    let stepFunctionsClient = new SFNClient({endpoint:'http://172.17.0.2:4566/'});
    let stateMachineResponse = await stepFunctionsClient.send(new StartExecutionCommand(params))
    console.log("State machine response : ",stateMachineResponse)


    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'Go Serverless v1.0! Your function executed successfully!',
                input: stateMachineResponse,
            },
            null,
            2
        ),
    };
}


export const postUserDetails = async (event:any, _context:any): Promise<object>  => {

    process.env.AWS_SECRET_ACCESS_KEY = 'test'
    process.env.AWS_ACCESS_KEY_ID = 'test'

    console.log("postUserDetails handler............................")

    console.log("State machine input data : ",event)

    const dbClient = new DynamoDBClient({endpoint:'http://172.17.0.2:4566/'});

    const params = {
        TableName: "demo-service-db",
        Item: {
            name: { S: "harsh" },
        },
    };
    try {
        const data = await dbClient.send(new PutItemCommand(params));
        console.log("dynamo db response : ",data);
    } catch (err) {
        console.error(err);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'First step executed successfully!',
                input: event,
            },
            null,
            2
        ),
    };
}


export const getUserDetails = async (event:any, _context:any): Promise<object>  => {

    process.env.AWS_SECRET_ACCESS_KEY = 'test'
    process.env.AWS_ACCESS_KEY_ID = 'test'

    console.log("getUserDetails handler............................")

    console.log("step function input : ",event)

    const dbClient = new DynamoDBClient({endpoint:'http://172.17.0.2:4566/'});

    const params = {
        TableName: "demo-service-db",
        Key: {
            name: { S: "harsh" },
        },
    };
    try {
        const data = await dbClient.send(new GetItemCommand(params));
        console.log("dynamo db response : ",data);
    } catch (err) {
        console.error(err);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: '2nd step executed successfully!',
                input: event,
            },
            null,
            2
        ),
    };
}
