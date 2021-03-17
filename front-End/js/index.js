$(document).ready(function () {
    pre.title = "";
    for (var i = 0; i < 6; i++) {
        pre.middleCourseResult1[i] = new Array();
        pre.middleCourseResult2[i] = new Array();
        auto.middleCourseResult[i] = new Array();
        for (var j = 0; j < 7; j++) {
            pre.middleCourseResult1[i][j] = {
                id: "",
                name: "",
                score: ""
            };
            pre.middleCourseResult2[i][j] = {
                id: "",
                name: "",
                score: ""
            };
            auto.middleCourseResult[i][j] = "";
        }
    }

    $('.mynav').click(function () {
        update($(this).attr('name'));

    });
    $('.classes').click(function () {
        if ($("input[name='classes']:checked").val() == "class1") {
            pre.is_class1 = true;
        } else {
            pre.is_class1 = false;
        }


    });
   
    

   
})

function backToMain(){
    //if it is in homepage now
    if($("#homePage").css('display') != "none")
        return;
    update("homePage");
    if($("#title").css('display') != "none")
        $("#title").toggle(100,'swing');
}

function update(type) {
    console.log(type);
    if($("#title").css('display') == "none")
        $("#title").toggle(100,'swing');
    if (type == "manualResults" || type == "autoResults")
        pre.title = " > 排课结果";
    else if (type == "statics")
        pre.title = " > 输入课程数据";
    else if (type == "filesInfo")
        pre.title = " > 文件上传与下载";
    else if (type == "classInfo")
        pre.title = " > 添加班级信息";
    else if (type == "homePage")
        ;    
    else 
        alert("error in update!");    
    $(".pre").each(function () {
        if ($(this).attr('id') == type)
            $(this).css('display', 'inline');
        else
            $(this).css('display', 'none');
    });
}


function login_complete(isConfirm) {
    console.log("关闭子页面");
    $('.new').remove();
    $('html,body').css('overflow', '');
    //location.reload();
    if(isConfirm){
        if (sessionStorage.getItem("classId") != '' && sessionStorage.getItem("classId") != null) {
            var classes = sessionStorage.getItem("classId").split(',');
            for (var i = 0; i < classes.length; i++) {
                var classCoursesTemp = [];
                var courseList = sessionStorage.getItem(classes[i]);
                console.log('page2-class', classes[i]);
                if (courseList != null && courseList != '') {
                    var courseLists = courseList.split('-');
                    for (var j = 0; j < courseLists.length; j++) {
                        var course = sessionStorage.getItem('courseids').split('-')[courseLists[j]];
                        var courseName = sessionStorage.getItem(course).split('&')[0];
                        classCoursesTemp.push({
                            id: course,
                            name: courseName
                        });
                    }
                }
                Vue.set(pre.classData, classes[i], classCoursesTemp);
            }
        }
        console.log("pre.classdata.class1",pre.classData.class1);
        console.log("pre.classdata.class2",pre.classData.class2);
    }
}

function toggleMain(event, type){
    var id;
    if($(event).hasClass("fa-caret-down"))
        $(event).removeClass("fa-caret-down").addClass("fa-caret-left");
    else    
        $(event).removeClass("fa-caret-left").addClass("fa-caret-down");
    if(type == "manual"){
        id = "#manual-main";
    }
    else{
        id = "#auto-main";
    }
    $(id).toggle(100,'swing');
}



