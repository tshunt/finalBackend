# finalBackend
==Study Website Backend API==

The main resource of this API is the meeting, with a supplementary user resource. 

The meeting is formatted as follows. All are type string unless otherwise stated: 

  className: Provided class name of which the meeting is for.

  time: Time at which the meeting will occur. 

  date: date on which the meeting will occur. 

  attendees: an array of strings detailing all attendees of a meeting. 

  location: location of the meeting. 

  id: unique number identifier of a meeting

  owner: which user created said meeting. 

  desc: a brief description of the meeting.

  comments: an array of strings housing the comments left for a meeting. 

The other object is the user, the user holds (again, strings unless notified):

  user: username
  
  password: password of user
  
  email: provided email of user
  
  major: listed major of user
  
  grad: numerical grad year of user
  
  house: whether user is on or off campus
  
  pronouns: listed pronouns of user. 



==Calls== 

get /meeting:

  If logged in, returns all meetings a person is part of.

get /userInfo: 

  If logged in, returns stored information about current user. 

get /meeting/:id:

  Returns a specific meeting id if a login has occured. 

get /meetingNames:

  If logged in, returns all classes which are listed in current meetings. 

get /meetingAll:

  If logged in, returns all current meetings in directory

post /meeting: 

  If logged in, creates a meeting from specified input. 
  The body must be json and hold the following parameters:
  className, time, date, attendees, location, desc, comments
  Note attendees should be empty if the only initial attendee wanted is the owner. 

post /meeting/join/:id:

  If logged in, attempts to add the user to the attendees list for the meeting.

post /meeting/comment/:id:

  If logged in, comments anonymously on a meeting, adding it to the meeting comments array.

put /meeting/:id:

  If the current logged in user is the owner of the meeting, update the meeting to new parameters. 
  The body must have all the parameters specified in the post /meeting call. 

delete /meeting/:id:

  If the user is the owner of the meeting, delete the meeting from the list. 

post /login:

  Login to the system, the body must be json and specify:
  user: the username
  password: the password
  This returns true on success. 

post /signup:

  Signup into the system. the body must by json and specify: 
  user
  password
  email
  major
  grad
  house
  pronouns
  This call returns true on success. 

get /logout:

  Logs a user out of the system. 


