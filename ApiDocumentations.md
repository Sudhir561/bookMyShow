## Api Documentations


------------------------------------------------------------------------------------------------------------------------------------------


Api Links/Endpoints
-------------------

For Frontend :-<br>
	On  local System = http://localhost:3000
	<br>
	Live Link  	=  https://book-show-ticket.netlify.app

For Backend :- <br>
	 

   (Get api and post api on booking-api folder on postman)
   
	postman link-https://www.postman.com/sudhir561/workspace/api-demo/folder/18127873-d3c0520b-51cf-4c76-b12f-04f284cb5bf8?ctx=documentation

   // backend api deploy on render.com
	Live Link = https://bookmyshow-backend-xipo.onrender.com/api/booking

This documentation provides detailed information on how to interact with our API to access various resources and functionalities within our application. This guide will help you integrate with our API seamlessly.
	
-----------------------------------------------------------------------------

		The Api uses the following Schema for post and get request. 

		Parameter	Type		Description

		movie		string		Required movie name
		slot		string		Required time slot
		seats		number		Required seats

		For POST REQUEST it Returns the newly created booking in JSON format	
		as well as for get Request but the last booking only.		
	

------------------------------------------------------------------------------


1st API =>   	POST Booking

	It is POST REQUEST.		
	This POST Api is for Creating a New Movie Booking with the use of Schema.
	
	Endpoint: 	https://www.postman.com/sudhir561/workspace/api-demo/request/18127873-5aac10e5-9acb-4cfa-87ea-de1efed69d91?ctx=documentation
	Method: 	POST
	Content-Type:  application/json
	Description:	This endpoint allows you to create a new movie booking.
	Request body :
				{
                 "movie":"Suraj par mangal bhari",
                 "seats":{
                           "A1": 5, 
                           "A2": 0,      
                           "A3": 0,       
                           "A4": 0,  
                           "D1": 0,      
                           "D2": 0         
                        },
                "slot":"03:00 PM"
                }

		
		screenshot below-
 ![backend-1](https://github.com/Sudhir561/bookMyShow/assets/89014041/646eb1b9-c136-4c4e-bcac-abdb9d55ab25)         
          		
	
		After hitting the post Request you will get the following response

		Status : 200OK,
		Response : 
		  {
              "movie": ["Suraj par mangal bhari"],
                        
                             
              "seats": {
                         "A1": [5],
                         "A2":[0],
                         "A3":[0],
                         "A4":[0],
                         "D1":[0],
                         "D2":[0],

               "slot": ["03:00 PM"]

                       }
       
   
          }

screenshot-
![backend-2](https://github.com/Sudhir561/bookMyShow/assets/89014041/9d2a8d5d-a326-4b06-94c1-e72847256e18)		  
 
In Case if you try to hit request without giving the movie,slot and seats  
it will give you a response with an error 

		Status   : 400 Bad Request,
		Response : {
   			     "ERROR": "Slot is  Required" 
			   }
'Same for movie name and seats if its empty' 
	{
   		 "ERROR": "Movie name is required" 
	},
	{
   		 "ERROR":  "Seats data is required"
	}

    
 ![backend-3](https://github.com/Sudhir561/bookMyShow/assets/89014041/ef7321b2-630f-4e2f-82af-19e5d5133f65)      


In Other Cases if not able to book it will throw errors depend on the conditions:
	
		Status 	 : 400 Bad Request,
		Response :  {
   		 		"ERROR": error (whatever error will come it shows here)
			    },

In Case you try to hit with same request data which is already existing 
it will give you a response with an error 

        Status 	 : 409 Conflict,
        Response:{
                   "error": "Movie "Movie name" with slot 'slot Time' and seat(s) '{\"A1\":,\"A2\":,\"A3\":,\"A4\":,\"D1\":,\"D2\":}' already has a booking."
                 }


  screenshot-
  
  ![backend-4](https://github.com/Sudhir561/bookMyShow/assets/89014041/ec599bbf-9a2c-4cb1-8b3b-eb7bde21bbe1)       
		
..............................................................................


2nd API =>  Get Last Booking

	It is GET REQUEST.		
	This GET Api is for getting the very last booking details.
			
	Endpoint     : 	https://www.postman.com/sudhir561/workspace/api-demo/request/18127873-325d896e-3597-432c-b29d-a370ca65baba?ctx=documentation

	Method       : 	GET
	Description  :	This endpoint allows you to get the details of the last booking made.

	After hitting the GET request you will get the following response.

	Status : 200OK,
	Response body:
			{
    		 "movie": "Suraj par mangal bhari,
   			 "seats": {
						"A1": [5],
						"A2": [0],
						"A3": [4],
						"A4": [0],
						"D1": [0],
						"D2": [0]
    				  },
   			 "slot": ["03:00 PM"]
			}
screenshot-
![last booking](https://github.com/Sudhir561/bookMyShow/assets/89014041/d8d996a8-9e6a-4f19-a78f-4da57cbf7666)
  	If there is no movies in our database it will send a response
		Status: 404,

   		Response : {
        	  	  	message: "no previous booking found." 
			       };
screenshot-
![backend-no previous ](https://github.com/Sudhir561/bookMyShow/assets/89014041/ea12fed7-f114-418d-b1a4-bff09180d787)


	In Case if any problem occur in getting the data 
	it will give you a response with an error 

	
		Status : 500,
    	Response: {
        	    error (whatever error happen it shows here)
		  };

..............................................................................................



=====================================================================
