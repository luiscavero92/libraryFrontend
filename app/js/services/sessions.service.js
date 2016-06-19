angular
	.module('library.services')
	.service('sessionsService', sessionsService);

  sessionsService.$inject = ['$cookies'];

  function sessionsService($cookies){

		this.setUserData = function(username, password){
			$cookies.put("userName", username);
			$cookies.put("password", password);
		}

		this.getUserData = function(){
			var userName = $cookies.get("userName");
			var password = $cookies.get("password");
			if(userName && password){
				var user = {
						"username" : userName,
						"password" : password
				}
			}else{
				user = null;
			}

			return user;
		}

		this.clearCookieData = function(){
				$cookies.remove("userName");
				$cookies.remove("password");
		}
	}
