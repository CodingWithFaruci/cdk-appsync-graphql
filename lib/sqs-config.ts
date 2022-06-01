import * as sqs from 'aws-cdk-lib/aws-sqs';

export const REQUEST_TEMPLATE = (accountId: String, queue: sqs.Queue) => {
  return `
  #set ($body = "Action=SendMessage&Version=2012-11-05")
  #set ($messageBody = $util.urlEncode($util.toJson($ctx.args)))
  #set ($queueUrl = $util.urlEncode("${queue.queueUrl}"))
  #set ($body = "$body&MessageBody=$messageBody&QueueUrl=$queueUrl")
  {
    "version": "2018-05-29",
    "method": "POST",
    "resourcePath": "/${accountId}/${queue.queueName}",
    "params": {
      "body": "$body",
      "headers": {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  }
  `;
};
  
export const RESPONSE_TEMPLATE = `
  #if($ctx.result.statusCode == 200)
      ##if response is 200
      ## Because the response is of type XML, we are going to convert
      ## the result body as a map and only get the User object.
      $utils.toJson($utils.xml.toMap($ctx.result.body).SendMessageResponse.SendMessageResult)
  #else
      ##if response is not 200, append the response to error block.
      $utils.appendError($ctx.result.body, "$ctx.result.statusCode")
      null
  #end
  `;