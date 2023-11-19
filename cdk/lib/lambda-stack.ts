import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from "path";

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const usersLambda = new lambda.Function(this, 'users-lambda', {
      handler:'handler.handler',
      code: lambda.Code.fromAsset(
          path.join(
              '..',
              'dist',
              'users',
              'users.zip'
          )
      ),
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: 'users-cdk-boilerplate',
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      }
    });

    const productsLambda = new lambda.Function(this, 'products-lambda', {
      handler:'handler.handler',
      code: lambda.Code.fromAsset(
          path.join(
              '..',
              'dist',
              'products',
              'products.zip'
          )
      ),
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: 'products-cdk-boilerplate',
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      }
    });
  }
}
