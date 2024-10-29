import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { server } from "../constants/config"

const api=createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({
        baseUrl:`${server}/api/v1`,
        credentials:"include"
    }),

    tagTypes:["User","Event"],
    endpoints:(builder)=>({
        createUserProfile:builder.mutation({
            query:({data,token})=>({
                url:"user",
                method:"POST",
                body:data,
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                }
            }),
            onQueryStarted:async (arg,{queryFulfilled})=>{
                try{
                    await queryFulfilled
                }
                catch(error){
                    console.error("Error creating user profile:",error)
                }
            }

        }),
        getUserProfile:builder.query({
            query:({token})=>({
                url:"user",
                method:"GET",
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                },
            }),
            onQueryStarted:async (arg,{queryFulfilled})=>{
                try{
                    await queryFulfilled
                }
                catch(error){
                    console.error("Error fetching user:",error)
                }
            }
        }),
        editUserProfile:builder.mutation({
            query:({data,token})=>({
                url:"user",
                method:"PUT",
                body:data,
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            }),
            onQueryStarted:async (arg,{queryFulfilled})=>{
                try{
                    await queryFulfilled
                }
                catch(error){
                    console.error("Error editing user profile:",error)
                }
            }
        }),
        createEvent:builder.mutation({
            query:({data,token})=>({
                url:"event",
                method:"POST",
                body:data,
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type':'application/json'
                }
            }),
            onQueryStarted:async (arg,{queryFulfilled})=>{
                try{
                    await queryFulfilled
                }
                catch(error){
                    console.error("Error creating event:",error)

                }
            }
        }),
        getEvent:builder.query({
            query:({token})=>({
                url:"event",
                method:"GET",
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                },
            }),
            onQueryStarted:async (arg,{queryFulfilled})=>{
                try{
                    await queryFulfilled
                }
                catch(error){
                    console.error("Error fetching user:",error)
                }
            }
        }),
        editEvent: builder.mutation({
            query: ({ id, data, token }) => ({
                url: `event/${id}`,  
                method: "PUT",
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }),
            onQueryStarted: async (arg, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                } catch (error) {
                    console.error("Error updating event:", error);
                }
            }
        }),
        deleteEvent: builder.mutation({
            query: ({ id, token }) => ({
                url: `event/${id}`,  
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }),
            onQueryStarted: async (arg, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                } catch (error) {
                    console.error("Error deleting event:", error);
                }
            }
        }),
        remindEvent: builder.mutation({
            query: ({ id,token }) => ({
                url: `event/remind/${id}`,  
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }),
            onQueryStarted: async (arg, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                } catch (error) {
                    console.error("Error updating event:", error);
                }
            }
        }),
        

    })
    
})

export default api

export const{
    useCreateUserProfileMutation,
    useGetUserProfileQuery,
    useEditUserProfileMutation,
    useCreateEventMutation,
    useGetEventQuery,
    useEditEventMutation,
    useDeleteEventMutation,
    useRemindEventMutation
}=api