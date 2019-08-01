const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: 'localhost:9200'
  });

module.exports = {

  GetTweets: async(req,res) => {
    
      const response = await client.search({
          index : 'twitter',
          body:{
            from: 0,size:20,
            sort:[{postedTime:{order:"asc"}}]
          }
      });  
      res.json({data: response.hits.hits});
  },

  GetTopByUser: async(req,res) =>{

    const {userName} = req.body;

    const response = await client.search({
      index : 'twitter',
      body:{
        from: 0,size:20,
        sort:[{postedTime:{order:"asc"}}],
        query:{
          match:{
            "usuario.preferredUsername" : userName
          }
        }
      }
    });
    res.json({data: response.hits.hits});
  },

  GetTopUser: async(req,res) => {

      const usuarios = [];

      const response = await client.search({
          index:'twitter',
          body:{
            query:{
              match:{
                "verb" : "post"
              }
            },
            aggregations: {
              "usuarios":{
                terms : { 
                  field : "usuario.preferredUsername",
                  size : 10,
                  order: {                      
                    "_count" : "desc" 
                  }                    
                },
                aggs : {
                  "types_count" : { "value_count" : { "field" : "usuario.preferredUsername" } }
                }  
              }
            }
          }          
      });
      res.json({data: response.aggregations.usuarios.buckets});
  },

  GetTweetOverTime: async(req,res) => {

    const {fechaInicio,fechaFin} = req.body;
    var tweetsOverTime = [];
    console.log(new Date(fechaInicio));
    const response = await client.search({
      index:'twitter',
      body:{
        query: {
          bool: {
              filter: {
                  range: {
                      "postedTime": {
                          "gte": new Date(fechaInicio),
                          "lte": new Date(fechaFin)
                      }
                  }
              }
          }
      },
        aggs: {
          tweets_over_time : {   
            date_histogram : {                        
              "field" : "postedTime",
              "interval" : "1h",
              "format": "dd/MM/yyyy HH:mm"
            }
          }            
        }
      }
    });

    const data = response.aggregations.tweets_over_time.buckets;
    for(var i = 0; i < data.length; i++){
        var item = data[i];
        var date = item.key_as_string.split(' ');        
        tweetsOverTime.push({fecha:date[0],hora:date[1],total:item.doc_count});
    }    
    res.json({total:tweetsOverTime.length,data: tweetsOverTime});

  }

}
