"use client"
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer  } from 'recharts';

export default  function PieChart({ data }: { data: any }) {
        
  return (
    <div className='w-full h-full min-h-56 md:h-[95%]'>

      <ResponsiveContainer className='w-full '>
        <BarChart data={data} margin={{ top: 30,left:10,right:10, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" type="category" angle={-45} textAnchor="end" dy={10} />
          <YAxis domain={[0, (dataMax : any) => Math.ceil(dataMax * 2)]}/>
          <Tooltip />
          <Legend layout='horizontal' align="center" verticalAlign='top' />
          <Bar dataKey="done_count" name={"Done"} stackId="a" fill="#12a0ff" unit={" Tasks"} >
           
          </Bar>
          <Bar dataKey="todo_count" name={"To do"} stackId="b" fill="rgb(255, 67, 211)" unit={" Tasks"} >
            
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
