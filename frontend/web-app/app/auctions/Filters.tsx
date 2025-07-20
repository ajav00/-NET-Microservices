import { useParamStore } from '@/hooks/useParamStore';
import { Button, ButtonGroup } from 'flowbite-react';
import React from 'react'
import { AiOutlineClockCircle, AiOutlineSortAscending } from 'react-icons/ai';
import { BsFillStopCircleFill, BsStopwatch, BsStopwatchFill } from 'react-icons/bs';
import { GiFinishLine, GiFlame } from 'react-icons/gi';

const pageSizeButtons = [4, 8, 12];

const orderButtons = [
    {
        label: 'Alphabetical',
        icon: AiOutlineSortAscending,
        value: 'make'
    },
    
    {
        label: 'End Date',
        icon: AiOutlineClockCircle,
        value: 'endingSoon'
    },
    
    {
        label: 'Recently Added',
        icon: BsFillStopCircleFill,
        value: 'new'
    }
]

const filterButtons = [
    {
        label: 'Live auctions',
        icon: GiFlame,
        value: 'live'
    },
    
    {
        label: 'Ending < 6 hours',
        icon: GiFinishLine,
        value: 'endingSoon'
    },
    
    {
        label: 'Completed',
        icon: BsStopwatchFill,
        value: 'finished'
    }
]

export const Filters = () => {
    const pageSize = useParamStore(state => state.pageSize);
    const setParams = useParamStore(state => state.setParams);
    const orderBy = useParamStore(state => state.orderBy);
    const filterBy = useParamStore(state => state.filterBy);


    return (
        <div className='flex justify-between items-center mb-4'>

            <div>
                <span className='uppercase text-sm text-gray-500 mr-2'>
                    Filter by
                </span>
                <Button.Group>
                    {
                        filterButtons.map(({label, icon: Icon, value})=>(
                            <Button
                                key={value}
                                onClick={()=> setParams({filterBy: value})}
                                color={`${filterBy === value} ? 'red' : 'green'`}
                                >
                                <Icon className='mr-3 h-4 w-4'/>
                                {label}
                            </Button>
                        ))
                    }
                </Button.Group>
            </div>

            <div>
                <span className='uppercase text-sm text-gray-500 mr-2'>
                    Order by
                </span>
                <Button.Group>
                    {
                        orderButtons.map(({label, icon: Icon, value})=>(
                            <Button
                                key={value}
                                onClick={()=> setParams({orderBy: value})}
                                color={`${orderBy === value} ? 'red' : 'green'`}
                                >
                                <Icon className='mr-3 h-4 w-4'/>
                                {label}
                            </Button>
                        ))
                    }
                </Button.Group>
            </div>

            <div>
                <span className='uppercase text-sm text-gray-500 mr-2'>
                    Page size
                </span>
                <ButtonGroup>
                {pageSizeButtons.map((value, i)=>(
                        <Button
                        className='focus:ring-0'
                        key={i}
                        onClick={() => setParams({pageSize: value})}
                        color={`${pageSize === value ? 'red' : 'gray'}`}
                    >
                        {value}
                    </Button>
                    ))}
                </ButtonGroup>
            </div>
        </div>
    )
}
