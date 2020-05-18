var app= new Vue({
    el:".nav-main",
    data:{
       
    },
    methods:{
        navOn:function($event){
            $event.currentTarget.className="nav-item nav-on";
        },
        navOff:function($event){
            $event.currentTarget.className="nav-item";
        },
        submitResult:function(){
            add_loader();
            var data={
                items:[],
                class1:[],
                class2:[],
            };
            data.items=pre.coursesData;
            var class1=pre.classData.class1;
            var class2=pre.classData.class2;
            for(var i=0;i<class1.length;i++)
            {
                data.class1.push(class1[i].id);
            }
            for(var i=0;i<class2.length;i++)
            {
                data.class2.push(class2[i].id);
            }
            
            console.log(JSON.stringify(data));
            
            add_loader();

             $.ajax({
                type: 'POST',
                url: '/todo/api/v1.0/tasks',
                data: JSON.stringify(data),
                contentType: "application/json", 
                dataType:"json",
                success: function(data){
                    
                   
                   // Vue.set(pre.courseResult,data);
                    pre.courseResult1=data.class1;
                    pre.courseResult2=data.class2;
                    console.log('data',data);                 
                    console.log('result',pre.courseResult1,'result2',pre.courseResult2);
                    resultTOMiddle();
                   //console.log(pre.coursesData);
                    remove_loader();
                },error:function(){
                    remove_loader();
                }
                
              });
        },
    }
})

var pre=new Vue({
    el:"#presentation",
    data:{
        title:"",
        courseId:"",
        courseName:"",
        courseScore:"",
        courseNum:"",
        is_class1:true,
        coursesData:[

        ],
        finalCourseId:[

        ],
        classData:{
            
        },
        courseResult1:[
           
        ],
        courseResult2:[
           
        ],
        middleCourseResult1:new Array(),
        middleCourseResult2:new Array(),
    },
    methods:{
        
        addCourse:function(){
            console.log('page1-coursedata',this.coursesData);
            this.coursesData.push({id:this.courseId,name:this.courseName,score:this.courseScore,num:this.courseNum});
            this.finalCourseId.push(this.courseId);
            this.courseId="";
            this.courseName="";
            this.courseScore="";
            this.courseNum="";
        },
        removeCourse:function(index){
            //console.log(index);
            this.coursesData.splice(index,1);
            this.finalCourseId.splice(index,1);
        },
        saveCourse:function(){
           
            console.log('page1-coursedata2',JSON.stringify(this.coursesData))
            for(var i=0;i<this.coursesData.length;i++)
            {
                var a=this.coursesData[i];
                var id=a.id;
                var name=a.name;
                var score=a.score;
                var num=a.num;
                var joins=name+'&'+score+'&'+num;
                console.log('page1-joins',joins);
                sessionStorage.setItem(id,joins);
                console.log( sessionStorage.getItem("dat2") );
            }
            sessionStorage.removeItem("courseids");
            var courseids=this.finalCourseId.join('-');
            console.log("page1-courseids",courseids);
            sessionStorage.setItem("courseids",courseids);
            alert("保存信息成功！");
           
        },
        addClass:function(){
            var login_div = document.createElement('iframe');
            var login_close = document.createElement('i');
            var blocker = document.createElement('div');
            login_div.src = "addClass.html";
            login_div.classList.add('login', 'new');
            login_close.classList.add('fa', 'fa-close', 'fa-2x', 'login_close', 'new');
            blocker.classList.add('box', 'new');
            var body = document.getElementById('container');
            body.insertBefore(login_div, body.childNodes[0]);
            body.insertBefore(login_close, body.childNodes[0]);
            body.insertBefore(blocker, body.childNodes[0]);
            $('html,body').css('overflow', 'hidden')
            $(".login_close").click(login_complete);
        },
        removeClass:function(index){
            alert("还在开发中，系统暂不提供此功能哦！")
        },
        
    },
    created:function(){
        var ids= sessionStorage.getItem("courseids");
        console.log("page1-ids",ids);
        if(ids != '' && ids != null)
           { 
                ids=ids.split("-");
                for(var i=0;i<ids.length;i++)
                {
                    this.finalCourseId.push(ids[i]);
                    var courseInfo=sessionStorage.getItem(ids[i]).split('&');
                    this.coursesData.push({id:ids[i],name:courseInfo[0],score:courseInfo[1],num:courseInfo[2]});
                }
            }    
    },
    mounted:function(){
        if(sessionStorage.getItem("classId") != '' && sessionStorage.getItem("classId") != null)
        {
            var classes=sessionStorage.getItem("classId").split(',');
            for(var i=0;i<classes.length;i++)
            {
                var classCoursesTemp = [];
                var courseList=sessionStorage.getItem(classes[i]);
                console.log('page2-class',classes[i]);
                if(courseList != null && courseList != '')
                {
                    var courseLists = courseList.split('-');
                    for(var j=0;j<courseLists.length;j++)
                    {
                        var course=sessionStorage.getItem('courseids').split('-')[courseLists[j]];
                        var courseName=sessionStorage.getItem(course).split('&')[0];
                        classCoursesTemp.push({id:course,name:courseName});
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
    }

})

$(document).ready(function(){
    pre.title=" > 输入课程数据";
    for(var i=0;i<5;i++)
    {
        pre.middleCourseResult1[i]=new Array();
        pre.middleCourseResult2[i]=new Array();
        for(var j=0;j<7;j++)
        {
            pre.middleCourseResult1[i][j]={id:"",name:"",score:""};
            pre.middleCourseResult2[i][j]={id:"",name:"",score:""};
        }
    }
    
    $('.mynav').click(function() {
        update($(this).attr('name'));
        
    });
    $('.classes').click(function() {
        if($("input[name='classes']:checked").val() == "class1")
        {
            pre.is_class1=true;
        }
        else{
            pre.is_class1=false;
        }
       
        
    });
    
})

function update(type) {
    //console.log(type);
    if(type=="results")
        pre.title=" > 排课结果";
    else if(type=="statics")
        pre.title=" > 输入课程数据";
    else 
        pre.title=" > 添加班级信息"
    $(".pre").each(function () {
            if($(this).attr('id')==type)
                $(this).css('display','inline');
            else
                $(this).css('display','none');
    });
}



function resultTOMiddle(){
    //console.log("yes");
    for(var i=0;i<pre.courseResult1.length;i++)
    {
        var row=i%5;
        var col=parseInt(i/5);
        pre.middleCourseResult1[row][col]=pre.courseResult1[i];
    }
    for(var i=0;i<pre.courseResult2.length;i++)
    {
        var row=i%5;
        var col=parseInt(i/5);
        pre.middleCourseResult2[row][col]=pre.courseResult2[i];
    }
}

function login_complete() {
    console.log("关闭子页面");
    $('.new').remove();
    $('html,body').css('overflow', '');
    location.reload();
    update("classInfo");
  }

  
function add_loader(){
    var text=document.createElement('span');
    var spinner = document.createElement('i');
    var blocker = document.createElement('div');
    text.innerText='排课计算中，请稍后';
    text.classList.add('new1');
    spinner.classList.add('fa', 'fa-spinner', 'fa-5x', 'fa-spin', 'new1');
    blocker.classList.add('box', 'new1');
    var body = document.getElementById('container');
    body.insertBefore(text, body.childNodes[0]);
    body.insertBefore(spinner, body.childNodes[0]);
    body.insertBefore(blocker, body.childNodes[0]);
    $('html,body').css('overflow', 'hidden')
    
}  
function remove_loader(){
    $('.new1').remove();
    $('html,body').css('overflow', '');
}