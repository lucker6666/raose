# Todos
---------

## Me

`PUT`     `/me/avatar`          change avatar of current user


## Member

+ `GET`  `/members`            get members
+ `POST`   `/members`            add a member
+ `GET` `/member/:id`  get a member info
+ `GET`  `/member/:id/feeds`   action hisoty
+ `GET`  `/memmber/:id/login_sum`  login history

Admin auth
+ `GET`   `/member/:id/login_histories`
+ 


## Account
+ `POST` `/account/signup`  register
+ `POST` `/account/send_active_mail` send active mail

Admin auth
+ `GET` `/account/send_active_mail_histories`
