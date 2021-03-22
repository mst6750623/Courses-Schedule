var pre = new Vue({
    el: "#manualMode",
    data: {
        title: "",
        courseId: "",
        courseName: "",
        courseScore: 0,
        courseNum: 0,
        class_choose: "班级1",
        coursesData: [

        ],
        finalCourseId: [

        ],
        classData: {

        },
        courseResult1: [

        ],
        courseResult2: [

        ],
        middleCourseResult1: new Array(),
        middleCourseResult2: new Array(),
        middleCourseResult: new Array()
    },
    methods: {

        addCourse: function () {
            //console.log('page1-coursedata', this.coursesData);
            this.coursesData.push({
                id: this.courseId,
                name: this.courseName,
                score: parseInt(this.courseScore),
                num: parseInt(this.courseNum)
            });
            this.finalCourseId.push(this.courseId);
            this.courseId = "";
            this.courseName = "";
            this.courseScore = 0;
            this.courseNum = 0;
        },
        removeCourse: function (index) {
            //console.log(index);
            this.coursesData.splice(index, 1);
            this.finalCourseId.splice(index, 1);
        },
        saveCourse: function () {

            //console.log('page1-coursedata2', JSON.stringify(this.coursesData))
            for (var i = 0; i < this.coursesData.length; i++) {
                var a = this.coursesData[i];
                var id = a.id;
                var name = a.name;
                var score = a.score;
                var num = a.num;
                var joins = name + '&' + score + '&' + num;
                //console.log('page1-joins', joins);
                sessionStorage.setItem(id, joins);
                //console.log(sessionStorage.getItem("dat2"));
            }
            sessionStorage.removeItem("courseids");
            var courseids = this.finalCourseId.join('-');
            //console.log("page1-courseids", courseids);
            sessionStorage.setItem("courseids", courseids);
            alert("保存信息成功！");

        },
        addClass: function () {
            var login_div = document.createElement('iframe');
            var login_close = document.createElement('i');
            var blocker = document.createElement('div');
            login_div.src = "addClass.html";
            login_div.classList.add('login', 'new');
            login_close.classList.add('fa', 'fa-close', 'fa-2x', 'login_close', 'new');
            blocker.classList.add('box', 'new');
            var body = document.getElementById('container');
            body.insertBefore(login_close, body.childNodes[0]);
            body.insertBefore(login_div, body.childNodes[0]);
            body.insertBefore(blocker, body.childNodes[0]);
            $('html,body').css('overflow', 'hidden')
            $(".login_close").click(function () {
                login_complete(false);
            });
        },
        removeClass: function (name) {
            var classes = sessionStorage.getItem("classId").split(',');
            for (var i = 0; i < classes.length; i++) {
                var className = name;
                //console.log(className, classes[i]);
                if (classes[i] == className) {
                    classes.splice(i, 1);
                    //this.classData.splice(i, 1);
                    Vue.delete(this.classData, className);
                    //console.log(this.classData);
                    sessionStorage.removeItem(className);
                }
            }
            var classid = classes.join(',');
            if (classes.length == 0)
                sessionStorage.removeItem("classId");
            else
                sessionStorage.setItem("classId", classid);
            //location.reload();
            update("classInfo");
        },
        classChange: function () {
            if (this.class_choose == "班级1") {
                this.middleCourseResult = this.middleCourseResult1;
            } else {
                this.middleCourseResult = this.middleCourseResult2;
            }
            
        },

    },
    created: function () {
        var ids = sessionStorage.getItem("courseids");
        //console.log("page1-ids", ids);
        if (ids != '' && ids != null) {
            ids = ids.split("-");
            for (var i = 0; i < ids.length; i++) {
                this.finalCourseId.push(ids[i]);
                var courseInfo = sessionStorage.getItem(ids[i]).split('&');
                this.coursesData.push({
                    id: ids[i],
                    name: courseInfo[0],
                    score: parseInt(courseInfo[1]),
                    num: parseInt(courseInfo[2])
                });
            }
        }
    },
    mounted: function () {
        if (sessionStorage.getItem("classId") != '' && sessionStorage.getItem("classId") != null) {
            var classes = sessionStorage.getItem("classId").split(',');
            for (var i = 0; i < classes.length; i++) {
                var classCoursesTemp = [];
                var courseList = sessionStorage.getItem(classes[i]);
                //console.log('page2-class', classes[i]);
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
                Vue.set(this.classData, classes[i], classCoursesTemp);
                //console.log(JSON.stringify(this.classData));

                //console.log(this.classData.getItem('class'));
                //console.log(this.classData.)
                //var classUni=this.classData.getItem
                //this.classData.classes
                //pre.classData = Object.assign({}, pre.classData, {
                //  age: 27,
                //  favoriteColor: 'Vue Green'
                // });// 方案二
            }
        }
        if (sessionStorage.getItem("class1-result") != null) {
            this.middleCourseResult1 = JSON.parse(sessionStorage.getItem("class1-result"));
        }
        if (sessionStorage.getItem("class2-result") != null) {
            this.middleCourseResult2 = JSON.parse(sessionStorage.getItem("class2-result"));
        }
    }

})