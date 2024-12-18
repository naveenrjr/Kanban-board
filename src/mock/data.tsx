import { Column, Task } from "../types";

export const initialColumns :Column[] = [
    {id: 'm46oxbsz', title: 'Todo'},
    {id: 'm46oxd53', title: 'In Progress'},
    {id: 'm46oyux4', title: 'Done'},
    {id: 'm46oyvxz', title: 'Blocked'},
 ]

export const initialTasks :Task[]=[
    {id: 'm46oxej2', columnId: 'm46oxbsz', content: 'Create API for analytics'},
    {id: 'm46oxezp', columnId: 'm46oxbsz', content: 'Create UI for analytics'},
    {id: 'm46oxfrn', columnId: 'm46oxd53', content: 'Build inital Dashboard'},
    {id: 'm46oxg44', columnId: 'm46oxd53', content: 'Build table'},
    {id: 'm46oz92l', columnId: 'm46oyux4', content: 'Landing page'},
    {id: 'm46oz9of', columnId: 'm46oyux4', content: 'About page'},
    {id: 'm46ozal3', columnId: 'm46oyvxz', content: 'Integrate Analytics'},
    {id: 'm46ozb2v', columnId: 'm46oyvxz', content: 'Build Secondary Dashboard'},
]