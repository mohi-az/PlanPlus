import Image from 'next/image'
import React from 'react'

export default function Stat({ icon,gif, title, value, desc }: { icon?: React.JSX.Element ,gif?:string | null, title: string, value: string, desc: string }) {
    return (
        <div className="stat  w-full gap-1 sm:p-5 sm:px-6">
            <div className="stat-figure text-secondary">
                {icon ?  icon :
                 <Image src={'/images/'+gif} width={70} height={70} alt={title}/> }
            </div>
            <div className="stat-title">{title}</div>
            <div className="stat-value">{value}</div>
            <div className="stat-desc">{desc}</div>
        </div>
    )
}
// .stat {
//     display: inline-grid;
//     width: 100%;
//     grid-template-columns: repeat(1, 1fr);
//     column-gap: 1rem /* 16px */;
//     border-color: var(--fallback-bc,oklch(var(--bc)/var(--tw-border-opacity)));
//     --tw-border-opacity: 0.1;
//     padding-left: 1.5rem /* 24px */;
//     padding-right: 1.5rem /* 24px */;
//     padding-top: 1rem /* 16px */;
//     padding-bottom: 1rem /* 16px */;
// }