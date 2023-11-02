import {Context} from "aws-lambda";
import log, {initLogger} from '../common/logger';

export const handler = (event: unknown, context: Context) => {
    initLogger({
        lambdaContext: context,
        additionalContext: {},
    });
    log.info('Beginning users lambda execution');
    return { statusCode: 200, body: JSON.stringify({ result: 'success', users: [] })}
}
