import React, { useState, useContext, useEffect,useRef,lazy,Suspense } from "react"
import {FollowingBranchesColumnContainer} from "../container/FollowingBranchesContainer";
import MyBranchesColumnContainer from "./MyBranchesColumn";
import {UserContext,PostsContext,AllPostsContext,TreePostsContext,
    UserActionsContext} from "../container/ContextContainer"
import FeedPosts,{ BranchPosts,AllPosts,TreePosts} from "./BranchPosts"
import {Helmet} from "react-helmet";
import { Switch, Route, Link, withRouter  } from 'react-router-dom'
import {Desktop,Tablet,Mobile} from "./Responsive"

function NonAuthenticationColumn(){
    return(
        <div className="box-border flex-fill" style={{padding:'10px 20px',
        alignItems:'center',WebkitAlignItems:'center',flexFlow:'column',WebkitFlexFlow:'column'}}>
            <Link to="/login" className="login-or-register">Login</Link>
            <span style={{fontSize:'1.4rem',color:'#a4a5b2'}}>or</span>
            <Link to="/register" className="login-or-register">Register</Link>
        </div>
    )
}

export function FrontPageLeftBar(){
    const [show,setShow] = useState(true);
    const userContext = useContext(UserContext);

    return(
        <div style={{ flexBasis:'22%', height:'max-content'}}>
            <div>
            {userContext.isAuth?
                <>
                <div className="box-border" style={{padding:'10px 20px'}}>
                    <div className="flex-fill" style={{alignItems:'center'}}>

                        <h1>My branches</h1>
                        <button role="button" onClick={()=>setShow(!show)} style={{
                            border:0,
                            color:'#1DA1F2',
                            fontSize:'1.3rem',
                            marginLeft:10,
                            marginTop:3,
                            backgroundColor:'transparent'
                        }}>{show?"hide":"show"}</button>
                    </div>
                    <MyBranchesColumnContainer show={show}/>
                </div>
                <div style={{marginTop:10}}>
                    <FollowingBranches/>
                </div>
                </>:
                <NonAuthenticationColumn/>}
                
            </div>
        </div>
    )
}

export function FollowingBranches(){
    return(
        <div style={{height:'max-content'}}>
            <div className="box-border" style={{padding:'10px 20px'}}>
            <p style={{
                    fontSize: "1.6em",
                    fontWeight: 600,
                    paddingBottom: 5,
                    margin: "-10px -20px",
                    backgroundColor: "#219ef3",
                    color: "white",
                    padding: "10px 20px",
                    marginBottom:10
                }}>Following</p>
                <FollowingBranchesColumnContainer/>
            </div>
        </div>
    )
}

export const FrontPage = React.memo(function FrontPage({externalPostId}){

    const actionContext = useContext(UserActionsContext);
    const userContext = useContext(UserContext);

    useEffect(()=>{
        actionContext.lastPostListType = 'front'
    },[])

    return(
        <>
            <Desktop>
                <FrontPageLeftBar/>
                <Switch>
                    <Route exact path="/" component={
                        (props) => userContext.isAuth?<FrontPageFeed device="desktop" {...props}/>:
                        <FrontPageAllPosts device="desktop" {...props}/>
                    }/>
                    <Route exact path="/all" component={(props)=> <FrontPageAllPosts device="desktop" {...props}/>}/>
                    <Route exact path="/tree" component={(props)=> <FrontPageTreePosts device="desktop" {...props}/>}/>
                </Switch>
                {/*<FrontPageRightBar/>*/}
            </Desktop>

            <Tablet>
            <Switch>
                <Route exact path="/" component={
                        (props) => userContext.isAuth?<FrontPageFeed device="tablet" {...props}/>:
                        <FrontPageAllPosts device="tablet" {...props}/>
                    }/>
                    <Route exact path="/all" component={(props)=> <FrontPageAllPosts device="tablet" {...props}/>}/>
                    <Route exact path="/tree" component={(props)=> <FrontPageTreePosts device="tablet" {...props}/>}/>
                </Switch>
            </Tablet>

            <Mobile>
            <Switch>
                    <Route exact path="/" component={
                        (props) => userContext.isAuth?<FrontPageFeed device="mobile" {...props}/>:
                        <FrontPageAllPosts device="mobile" {...props}/>
                    }/>
                    <Route exact path="/all" component={(props)=> <FrontPageAllPosts device="mobile" {...props}/>}/>
                    <Route exact path="/tree" component={(props)=> <FrontPageTreePosts device="mobile" {...props}/>}/>
                </Switch>
            </Mobile>
            
        </>
    )
})

export const FrontPageFeed = React.memo(function FrontPageFeed(props){
    const context = useContext(UserContext);
    const postsContext = useContext(PostsContext);
    const [uri,setUri] = useState('initialUri')
    const branch = context.currentBranch.uri;
    const [params,setParams] = useState(null);

    useEffect(()=>{
        return ()=>{
            let lastVisibleElements = document.querySelectorAll('[data-visible="true"]');
            postsContext.lastVisibleElement = lastVisibleElements[0];
            let indexes = [];
            for(let el of lastVisibleElements){
                indexes.push(el.dataset.index)
            }
            let middle = indexes[Math.floor(indexes.length / 2)];
            postsContext.lastVisibleIndex = indexes.length>0?middle:0;
        }
    },[])

    if(context.isAuth){
        return(
            <>
            <Helmet>
                <title>Home - Subranch</title>
                <meta name="description" content="Your personal feed created from the communities you follow." />
            </Helmet>
            <FeedPosts uri={uri} setUri={setUri} activeBranch={context.currentBranch}
            postedId={context.currentBranch.id} usePostsContext showPostedTo 
            branch={branch} params={params} setParams={setParams} isFeed
            />
            </>
        )
    }else{
        return null
    }
})

export const FrontPageAllPosts = React.memo(function FrontPageAllPosts(props){
    const context = useContext(UserContext);
    const postsContext = useContext(AllPostsContext);
    const [uri,setUri] = useState('initialUri')
    const branch = context.isAuth?context.currentBranch.uri:null;
    const [params,setParams] = useState(null);

    useEffect(()=>{
        return ()=>{
            let lastVisibleElements = document.querySelectorAll('[data-visible="true"]');
            postsContext.lastVisibleElement = lastVisibleElements[0];
            postsContext.lastVisibleIndex = lastVisibleElements[0]?lastVisibleElements[0].dataset.index:0;
        }
    },[])


    return(
        <>
        <Helmet>
            <title>All - Subranch</title>
            <meta name="description" content="Browse all the leaves created 
            by the subranch community." />
        </Helmet>
        <AllPosts uri={uri} setUri={setUri} activeBranch={context.currentBranch}
        postedId={context.isAuth?context.currentBranch.id:null} usePostsContext showPostedTo 
        branch={branch} params={params} setParams={setParams} isFeed
        />
        </>
    )
})

export const FrontPageTreePosts = React.memo(function FrontPageAllPosts(props){
    const context = useContext(UserContext);
    const postsContext = useContext(TreePostsContext);
    const [uri,setUri] = useState('initialUri')
    const branch = context.isAuth?context.currentBranch.uri:null;
    const [params,setParams] = useState(null);

    useEffect(()=>{
        return ()=>{
            let lastVisibleElements = document.querySelectorAll('[data-visible="true"]');
            postsContext.lastVisibleElement = lastVisibleElements[0];
            postsContext.lastVisibleIndex = lastVisibleElements[0]?lastVisibleElements[0].dataset.index:0;
        }
    },[])


    return(
        <>
        <Helmet>
            <title>Tree - Subranch</title>
            <meta name="description" content="Browse all the leaves created 
            by the subranch community." />
        </Helmet>
        <TreePosts uri={uri} setUri={setUri} activeBranch={context.currentBranch}
        postedId={context.isAuth?context.currentBranch.id:null} usePostsContext showPostedTo 
        branch={branch} params={params} setParams={setParams} isFeed
        />
        </>
    )
})