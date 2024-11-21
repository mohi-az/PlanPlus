import Image from 'next/image'
import React from 'react'

export default function Stat({ icon,gif, title, value, desc }: { icon?: React.JSX.Element ,gif?:string | null, title: string, value: string, desc: string }) {
    return (
        <div> <div className="stat">
            <div className="stat-figure text-secondary">
                {icon ?  icon :
                 <Image src={'/images/'+gif} width={70} height={70} alt={title}/> }
            </div>
            <div className="stat-title">{title}</div>
            <div className="stat-value">{value}</div>
            <div className="stat-desc">{desc}</div>
        </div></div>
    )
}
