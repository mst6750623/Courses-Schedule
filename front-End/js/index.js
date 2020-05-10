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
        }
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
        coursesData:[

        ],
        finalCourseId:[

        ],
        classData:{
            
        },
        courseResult:[
            {id:"111",name:"高数1",score:"5"},
            {id:"111",name:"高数1",score:"5"},
            {id:"222",name:"线代1",score:"3"},
            {id:"222",name:"线代1",score:"3"},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"333",name:"物理",score:"3"},
            {id:"333",name:"物理",score:"3"},
            {id:"333",name:"物理",score:"3"},
            {id:"",name:"",score:""},

            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"111",name:"高数1",score:"5"},
            {id:"111",name:"高数1",score:"5"},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"444",name:"体育",score:"1"},
            {id:"444",name:"体育",score:"1"},
            {id:"111",name:"",score:""},
            {id:"111",name:"",score:""},
            {id:"111",name:"",score:""},
            {id:"111",name:"",score:""},

            {id:"111",name:"高数1",score:"5"},
            {id:"111",name:"高数1",score:"5"},
            {id:"222",name:"线代1",score:"3"},
            {id:"222",name:"线代1",score:"3"},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"333",name:"物理",score:"3"},
            {id:"333",name:"物理",score:"3"},
            {id:"333",name:"物理",score:"3"},
            {id:"",name:"",score:""},

            {id:"111",name:"高数1",score:"5"},
            {id:"111",name:"高数1",score:"5"},
            {id:"222",name:"线代1",score:"3"},
            {id:"222",name:"线代1",score:"3"},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"333",name:"物理",score:"3"},
            {id:"333",name:"物理",score:"3"},
            {id:"333",name:"物理",score:"3"},
            {id:"",name:"",score:""},


            {id:"111",name:"高数1",score:"5"},
            {id:"111",name:"高数1",score:"5"},
            {id:"222",name:"线代1",score:"3"},
            {id:"222",name:"线代1",score:"3"},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"333",name:"物理",score:"3"},
            {id:"333",name:"物理",score:"3"},
            {id:"333",name:"物理",score:"3"},
            {id:"",name:"",score:""},

            {id:"111",name:"高数1",score:"5"},
            {id:"111",name:"高数1",score:"5"},
            {id:"222",name:"线代1",score:"3"},
            {id:"222",name:"线代1",score:"3"},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"333",name:"物理",score:"3"},
            {id:"333",name:"物理",score:"3"},
            {id:"333",name:"物理",score:"3"},
            {id:"",name:"",score:""},

            {id:"111",name:"高数1",score:"5"},
            {id:"111",name:"高数1",score:"5"},
            {id:"222",name:"线代1",score:"3"},
            {id:"222",name:"线代1",score:"3"},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"",name:"",score:""},
            {id:"333",name:"物理",score:"3"},
            {id:"333",name:"物理",score:"3"},
            {id:"333",name:"物理",score:"3"},
            {id:"",name:"",score:""},
        ],
        middleCourseResult:new Array(),
    },
    methods:{
        addCourse:function(){
            console.log(this.coursesData);
            this.$data.coursesData.push({id:this.$data.courseId,name:this.$data.courseName,score:this.$data.courseScore,num:this.$data.courseNum});
            this.$data.finalCourseId.push(this.$data.courseId);
            this.courseId="";
            this.courseName="";
            this.courseScore="";
            this.courseNum="";
        },
        remove:function(index){
            console.log(index);
            this.$data.coursesData.splice(index,1);
            this.$data.finalCourseId.splice(index,1);
        },
        submitCourse:function(){
           
            console.log(JSON.stringify(this.$data.coursesData))
            for(var i=0;i<this.$data.coursesData.length;i++)
            {
                var a=this.$data.coursesData[i];
                var id=a.id;
                var name=a.name;
                var score=a.score;
                var num=a.num;
                var joins=name+'&'+score+'&'+num;
                console.log(joins);
                sessionStorage.setItem(id,joins);
                console.log( sessionStorage.getItem("dat2") );
            }
            sessionStorage.removeItem("courseids");
            var courseids=this.$data.finalCourseId.join('-');
            console.log("courseids",courseids);
            sessionStorage.setItem("courseids",courseids);
            alert("保存信息成功！");
           /* $.ajax({
                type: 'POST',
                url: 'http://127.0.0.1:5000/todo/api/v1.0/tasks',
                data: JSON.stringify(this.$data.coursesData),
                contentType: "application/json", 
                dataType:"json",
                success: function(data){
                    console.log(data)
                },
                
              });*/
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
        
    },
    created:function(){
        var ids= sessionStorage.getItem("courseids");
        if(ids != null)
            ids=ids.split("-");
        
        for(var i=0;i<ids.length;i++)
            {
                this.$data.finalCourseId.push(ids[i]);
                var courseInfo=sessionStorage.getItem(ids[i]).split('&');
                this.$data.coursesData.push({id:ids[i],name:courseInfo[0],score:courseInfo[1],num:courseInfo[2]});
            }    
    },
    mounted:function(){
        if(sessionStorage.getItem("classId") != null)
        {
            var classes=sessionStorage.getItem("classId").split(',');
            for(var i=0;i<classes.length;i++)
            {
                
                Vue.set(this.classData, classes[i], []);
                console.log(JSON.stringify(this.classData))
                var classUni=this.classData.getItem
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
    for(var i=0;i<12;i++)
    {
        pre.middleCourseResult[i]=new Array();
        for(var j=0;j<7;j++)
        {
            pre.middleCourseResult[i][j]={id:"",name:"",score:""};
        }
    }
    
    $('.mynav').click(function() {
        update($(this).attr('name'));
        
    });
    resultTOMiddle();
})

function update(type) {
    console.log(type);
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
    console.log("yes");
    for(var i=0;i<pre.courseResult.length;i++)
    {
        var row=i%12;
        var col=parseInt(i/12);
        //console.log(row,col);
        pre.middleCourseResult[row][col]=pre.courseResult[i];
    }
}

function login_complete() {
    $(".new").remove();
    $('html,body').css('overflow', '');
  }