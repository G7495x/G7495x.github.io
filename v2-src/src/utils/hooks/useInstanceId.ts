import {v4 as uuidv4} from 'uuid'
import {useState} from 'react'

/**
 * Gives a unique ID for each component instance.
 */
export default function useInstanceId(){ return useState(uuidv4)[0] }