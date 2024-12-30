import React from 'react'
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBusinesses, getBusinessesWithFilters } from '@/utils/fetching';
// const queryClient = useQueryClient();
import axios from 'axios';

import BusinessCard from '@/components/BusinessCard';
import Pagination from '@/components/Pagination';

function SearchPage() {
    const [businesses, setBusinesses] = useState(null);
    const [currentLimit, setCurrentLimit] = useState(0);//preparation for pagination
    const [currentPage, setCurrentPage] = useState(1);//preparation for pagination
    const [resultsPerPage, setResultsPerPage] = useState(20)//preparation for pagination
    const currentOffset = currentLimit * currentPage - currentLimit;//preparation for pagination
    let totalResults = 0;//preparation for pagination
    let totalPages = 1;//preparation for pagination
    if(businesses && businesses.length > 0) {//preparation for pagination
        totalResults = businesses.length//preparation for pagination
        totalPages = Math.ceil(totalResults / resultsPerPage);//preparation for pagination
    };
    const location = useLocation();
    const { searchInput, loggedUser, userToken } = location.state;
    
    // const { isLoading, error, data } = useQuery({
    //     queryKey:['businessesData'],
    //     queryFn: getBusinesses
    // })
    // useEffect(() => {
    //     if(data) {
    //         setBusinesses(data);
    //     }
    // }, [data])
    useEffect(() => {
        console.log("search page useEffect says searchInput has changed:", searchInput);
        const getData = async () => {
            const data = await getBusinessesWithFilters(searchInput, null, currentLimit, currentOffset);
            setBusinesses(data);
        }
        getData();
    }, [searchInput])
    // if(!isLoading && data) console.log("search page says:", data);
    function handlePageChange(page: string | number){
        console.log("searchPage says the current page is: ", page);
    }

    //these should be moved to utils.fetching
    async function handleSubscribe(businessId){
        try {
            console.log("searchPage.handleSubscribe says current token is:", userToken);
            const result = await axios.post(`http://localhost:3000/businesses/${businessId}/subscribe`, {jwt:userToken})
            console.log("search page says result of handleSubscribe is:", result);
        } catch (error) {
            console.log(error);
        }
    }
    //I should have either created the unsubscribe as post instead of delete, or added the token to the url and got it in the server from there...
    // async function handleUnSubscribe(businessId){
    //     try {
    //         const result = await axios.delete(`http://localhost:3000/businesses/${businessId}/unsubscribe`)
    //         console.log("search page says result of handleSubscribe is:", result);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    async function handleDelete(businessId){
        try {
            const result = await axios.post(`http://localhost:3000/businesses/${businessId}/delete`, {jwt:userToken})
            console.log("search page says result of handleDelete is:", result);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <div>
                {businesses && `results count: ${businesses.length}`}
                <br></br>
                <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange}/>
                <br></br>
                <div>
                    {businesses && businesses.map(business => <BusinessCard key={business._id} businessInfo={business} handleSubscribe={handleSubscribe} handleDelete={handleDelete}/>)}
                </div>
            </div>
        </div>
    )
}

export default SearchPage;