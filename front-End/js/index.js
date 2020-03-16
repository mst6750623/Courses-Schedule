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
        classData:[
            
        ],
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
        addClass:function(){
            this.$data.classData.push({id:this.$data.courseId,name:this.$data.courseName,score:this.$data.courseScore,num:this.$data.courseNum});
           
            this.courseId="";
            this.courseName="";
            this.courseScore="";
            this.courseNum="";
        },
        remove:function(index){
            console.log(index);
            this.classData.splice(index,1);
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
    else
         pre.title=" > 输入课程数据";
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
        console.log(row,col);
        pre.middleCourseResult[row][col]=pre.courseResult[i];
    }
}