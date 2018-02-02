var companyInfoIsFilled = 0;
$(function() {

	if(localStorage.loginUserInfo) {
		var jsonData = localStorage.loginUserInfo;
		$("#user_name").text(JSON.parse(jsonData).business_user_name);

		if(localStorage.companyInfo) {
			console.log("公司信息",JSON.parse(localStorage.companyInfo))
			$("#user_header_img").attr("src", JSON.parse(localStorage.companyInfo).company_logo != null ? JSON.parse(localStorage.companyInfo).company_logo : "/webapp/recruiters_release/img/example_logo.png");
			if(JSON.parse(localStorage.companyInfo).short_company_name != null) {
				companyInfoIsFilled = 1;
			};
			//判断是否显示BEMO
			if(localStorage.bemo) {
				if(localStorage.bemo == 1) {
					$("#robotSeeting").addClass("disinblock")
					$("#robotSeeting").show();
				}
			} else {
				startHttpRequest("GET", "bemo_joho/getCompanyIsBemoOwner/" + JSON.parse(localStorage.companyInfo).company_id, null, function(status, mess, data) {
					if(status == 2000) {
						console.log("BEMO", data);
						localStorage.bemo = data;
						if(data == 1) {
							$("#robotSeeting").addClass("disinblock")
							$("#robotSeeting").show();
						}
					}
				});
			}
		} else {
			startHttpRequest("get", "joho/business_user/setting/company_info", null, function(status, message, data) {
				console.log("用户信息======", data);
				if(status == 2000) {
					localStorage.companyInfo = JSON.stringify(data);
					if(data.location_name != null) {
						companyInfoIsFilled = 1;
					}
					$("#user_header_img").attr("src", data.company_logo != null ? data.company_logo : "/webapp/recruiters_release/img/example_logo.png");
					//判断是否显示BEMO
					if(localStorage.bemo) {
						if(localStorage.bemo == 1) {
							$("#robotSeeting").addClass("disinblock")
							$("#robotSeeting").show();
						}
					} else {
						startHttpRequest("GET", "bemo_joho/getCompanyIsBemoOwner/" + JSON.parse(localStorage.companyInfo).company_id, null, function(status, mess, data) {
							if(status == 2000) {
								console.log("BEMO", data);
								localStorage.bemo = data;
								if(data == 1) {
									$("#robotSeeting").addClass("disinblock")
									$("#robotSeeting").show();
								}
							}
						});
					}
				}
			});
		}

	} else {
		getUserInfo();
	}

	initNavHref();
	checkNavIndex();
});

function checkNavIndex() {
	$("nav.nav-title ul a").removeClass("nav-active");
	if(window.location.href.indexOf("homePage") > 0) {
		$("#navHomePage").addClass("nav-active");
	} else if(window.location.href.indexOf("positionManagement") > 0 || window.location.href.indexOf("job_id=") > 0 || window.location.href.indexOf("joho_id=") > 0) {
		$("#navPosiManage").addClass("nav-active");
	} else if(window.location.href.indexOf("talentStore.html") > 0 || window.location.href.indexOf("?taho_id=") > 0) {
		$("#navTalent").addClass("nav-active");
	} else if(window.location.href.indexOf("robotSetting") > 0) {
		$("#robotSeeting").addClass("nav-active");
	} else if(window.location.href.indexOf("shareTalent/index.html") > 0) {
		$("#navTalentShore").addClass("nav-active");
	}
}

function initNavHref() {
	$("#navHomePage,#home-img").attr("href", G_URL_WEB + "recruiters_release/homePage/view/index.html");
	$("#navHomePagePhone").attr("href", G_URL_WEB + "recruiters_release/homePage/view/index.html");
	$("#navAcountSetting").attr("href", G_URL_WEB + "recruiters_release/infosAndSetting/setting/setting.html");
	$("#navPosiManage").attr("href", G_URL_WEB + "recruiters_release/positionManagement/index.html");
	$("#navPosiManagePhone").attr("href", G_URL_WEB + "recruiters_release/positionManagement/index.html");
	$("#navTalent").attr("href", G_URL_WEB + "recruiters_release/talentCenter/shareTalent/talentStore.html");
	$("#navTalentPhone").attr("href", G_URL_WEB + "recruiters_release/talentCenter/shareTalent/talentStore.html");
	$("#navCompanyInfo").attr("href", G_URL_WEB + "recruiters_release/infosAndSetting/companyInfo/companyInfo.html");
	//$("#navCompanyInfo").attr("href", G_URL_WEB + "recruiters_release/infosAndSetting/companyInfo/newCompanyInfo.html");
	$("#robotSeeting").attr("href", G_URL_WEB + "recruiters_release/robotSetting");
	$("#navTalentShore").attr("href", G_URL_WEB + "recruiters_release/talentCenter/shareTalent/index.html")
	$("#navLoginOut").click(function() {
		loginOut();
	});
	$("#navLoginOutPhone").click(function() {
		loginOut();
	});
	$("#btnOfMessage").attr("src", G_URL_WEB + "recruiters_release/tahoManagement/img/icon-message.png");
	$("#btnOfMessage").click(function() {
		location.href = G_URL_WEB + "recruiters_release/messages/messages.html";
	});
	$("#navMessagePhone").click(function() {
		location.href = G_URL_WEB + "recruiters_release/messages/messages.html";
	});
}

function loginOut() {
	//清空localStorage
	localStorage.clear();
	startHttpRequest("GET", "business_user/logout", null, function(status, mess, data) {
		if(status == 2000) {
			localStorage.removeItem("userNamePwd");
			location.href = G_URL_WEB + "recruiters_release/indexFile/";
		} else {
			alert(mess);
		}
	});
}

function getUserInfo() {
	var loginData = {};
	if(localStorage.userNamePwd) {
		loginData = strToJson(localStorage.userNamePwd);
		//console.log(loginData);
		startLoginHttpRequest("post", "business_user/authenticate", JSON.stringify(loginData), function(status, message, jsonData, token) {
			if(status == 2000) {
				localStorage.loginUserInfo = jsonData;
				$("#user_name").text(jsonData.business_user_name);
				//$("#user_des").text(jsonData.business_user_position ? jsonData.business_user_position : "暂无");
				startHttpRequest("get", "joho/business_user/setting/company_info", null, function(status, message, data) {
					console.log("用户信息======", data);
					if(status == 2000) {
						if(data.company_name != null) {
							companyInfoIsFilled = 1;
						}
						$("#user_header_img").attr("src", data.company_logo != null ? data.company_logo : "/webapp/recruiters_release/img/example_logo.png");
					}
				});
			}
		});
	}
}