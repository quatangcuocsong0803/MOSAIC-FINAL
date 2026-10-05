"use client";
import {useEffect} from 'react';import {recordKnowledgeSearch} from '@/app/actions/knowledge-search';
export default function SearchTracker({query}:{query:string}){useEffect(()=>{if(query)void recordKnowledgeSearch(query);},[query]);return null;}
