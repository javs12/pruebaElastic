# pruebaElastic

#IMPORTACION DE MONGOdB A ELASTIC 

primero ejecutamos mongoexport 

$mongoexport -db <nombreDB> --collection <nombreCollection> --out <ruta del archivo de salida>

mongoexport --db KMetrics --collection tweets --out tweet.json

despues nos ayudamos de una paqueteria de node

$npm install elastic-import -g

y por ultimo importamos la data 

$elastic-import <data> 127.0.0.1:9200 <index> <type> --mongo

elastic-import tweet.json 127.0.0.1:9200 twitter _doc --mongo

para este caso tuve que hacer una modificacion a la propiedad del usuario <preferredUsername> => "fielddata": true para poder generar la busqueda mediante el usuario 

PUT http://localhost:9200/twitter/_mapping

{
	"properties": {
	    "usuario": {
	        "properties": {
	            "preferredUsername": {
	               "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            },
                            "fielddata": true
	            }
	        }
	    }
  }
}
