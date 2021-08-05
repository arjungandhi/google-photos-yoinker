import json

import urllib3

def lambda_handler(event, context):

    
    if event['url'].strip() == '':
        return {
            'statusCode': 400,
            'body': 'Oi stupid give me an album share url'
        }
    http = urllib3.PoolManager()
    r = http.request('GET',event['url'].strip())
    
    # try decoding data 
    try:
        s = str(r.data, 'utf-8')
    except:
        s = 'not a string'
    return {
        'statusCode': r.status,
        'body': {'data':s,'redirected':bool(r.retries.history)}
    }

