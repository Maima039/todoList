import {Component, ViewChild} from '@angular/core';


const todos= [
  {
    id:1,
    title:'eat',
    done:false
  }, {
    id:2,
    title:'drink',
    done:false
  }, {
    id:3,
    title:'sleep',
    done:true
  }
]

@Component({
  // selector: <app-root></app-root>
  selector: 'app-root',
  // connected html
  templateUrl: './todo.html',
  // connected css
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todoAngular';
  show01 = true

  public todos:{
    id:number,
    title:string,
    done:boolean
  }[] =JSON.parse(window.localStorage.getItem('todos')||'[]')

  public currentEditing:{
    id:number|null,
    title:string|null,
    done:boolean|null
  }= {id:null,title:null,done:null}

// 8.Routes

  ngOnInit(){
    this.hashchangeHandler()
    // refresh
    // Note：use bind (this)
    window.onhashchange=this.hashchangeHandler.bind(this)
  }
  public visibility: string = 'all'

  // @ts-ignore
  get filterTodos(){
    if (this.visibility==='all'){
      return this.todos
    } else if (this.visibility==='active'){
      return this.todos.filter(t=>!t.done)
    }else if (this.visibility ==='completed'){
      return this.todos.filter(t=>t.done)
    }
  }

// 2. Add task
  addTodo (e:any):void{
    const titleTxt=e.target.value
    if (!titleTxt.length){
      return
    }
    const last = this.todos[this.todos.length-1]
    // add input
    this.todos.push({
      id:last?last.id+1:1,
      title:titleTxt,
      done:false
    })
    // clear input
    e.target.value=''
  }

  // 4.task
  get toggleAll(){
    return this.todos.every(t=>t.done)
  }
  set toggleAll(val){
    this.todos.forEach(t=>t.done=val)
  }
  // delete task
  removeTodo(i:number){
    this.todos.splice(i,1)
  }

// 5. Edit task
  saveEdit(todo: { title: any}, e: any){
    // save edit
    todo.title = e.target.value
    // reset edit style
    this.currentEditing={id:null,title:null,done:null}
  }
  handleEditKeyup(e: any){
    const {keyCode,target}=e
    //esc
    if (keyCode===27){
      // reset to previous title
      target.value=this.currentEditing.title
      // cancel edit
      this.currentEditing={id:null,title:null,done:null}
    }
  }

// 6.Show incomplete tasks
  get remainingCount(){
    return this.todos.filter(t=>!t.done)
  }

  hashchangeHandler(){
      const hash = window.location.hash.substr(1)
      switch (hash){
        case '/':
          this.visibility='all'
          break;
        case '/active':
          this.visibility='active'
          break;
        case '/completed':
          this.visibility='completed'
          break;
      }
  }

// 7. clear completed
  clearAllDone(){
    this.todos=this.todos.filter(t=>!t.done)
  }

// 9. save data to localStorage
  ngDoCheck(){
    window.localStorage.setItem('todos', JSON.stringify(this.todos))
  }
}
