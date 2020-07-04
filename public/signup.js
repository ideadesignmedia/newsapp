class News extends HTMLElement {
    constructor(){
        super()
        this.shadow = this.attachShadow({mode:'open'})
    }
    hintRes(){
        setTimeout(()=>{
            this.hint.innerHTML = this.init
            this.hint.className = this.norm
        }, 2350)
    }
    connectedCallback(){
        this.shadow.innerHTML = `<style>
                .hidden {
                    display: none!important;
                }
                #contain {
                    max-width: 100%;
		width: 100%;
                    overflow-x: hidden;
		display: block;
		margin: 0px;
		padding: 0px;
		overflow-y: scroll;
                }
                #newsform {
                    width: 100%;
                    max-width: 100%;
                    height: auto;
                    max-height: 100%;
                    overflow-x: hidden;
                    overflow-y: scroll;
                    display: grid;
                    grid-template-columns: 1fr;
                    background-color: white;
		margin: 0px;
		padding: 0px;
                }
                #hint {
                    width: 100%;
                    max-width: 100%;
                    text-align: center;
                    font-weight: 800;
                    font-size: 18px;
                    padding: 40px 0px;
                    cursor: default;
                    text-shadow: 1px 1px 5px #00000030;
                    box-shadow: 2px 3px 4px #00000010;
                    transition: 300ms ease;
		margin: 0px;
                }
                .errspan {
                    background-color: red;
                }
                .cool {
                    background-color: #9abc48;
                }
                .bind1 {
                    width: 100%;
                    max-width: 100%;
                    display: inline-flex;
                    padding: 10px 0px;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    flex-direction: column;
		margin: 0px;
		width: auto;
                }
                #topicselector {
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
                    max-width: 100%;
                    overflow-y: hidden;
                    overflow-x: scroll;
                    grid-gap: 20px;
                    padding: 10px 0px;
                    background-color: black;
                    border-radius: 10px;
                    box-shadow: 1px 1px 5px #00000030;
		margin: 0px;
		width: auto;
                }
                #topicselector::-webkit-scrollbar {
                    background-color: #9abc48;
                    opacity: .8;
                }
                #topicselector::-webkit-scrollbar-thumb {
                    background-color: black;
                    max-width: 10%;
                    border-radius: 100px;
                    cursor: hand;
                }
                #topicselector label {
                    color: white;
                }
                #topicselector::-webkit-scrollbar-button {
                    background-color: white;
                    color: #9abc48;
                    border-radius: 10px;
                    pading: 5px;
                    cursor: pointer;
                }
                #topicselector::-webkit-resizer {
                    display: none!important;
                }
                .bind2 {
                    width: 80%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    padding: 10px;
                    max-width: 80%;
		margin: 0px;
                }
                input {
                    background-color: black;
                    color: #9abc48;
                    max-width: 100%;
                    font-size: 1.2rem;
		margin: 0px;
		padding: 0px;
		border-radius: 10px;
                }
                label {
                    font-size: 1rem;
                    color: black;
                    font-weight: 800;
                    text-align: center;
		margin: 0px;
                    margin-bottom: 5px;
                    max-width: 100%;
                }
                #submitbut {
                    width: 100%;
                    max-width: 100%;
		margin: 0px;
		padding: 0px;
                    align-items center;
                    font-size: 1.1rem;
                    cursor: pointer;
                    box-shadow: -20px 1px 5px #00000050;
                }
                #submitbut:hover {
                    color: white;
                }
                sup {
                    font-weight: 800;
                    color: darkred;
                    text-shadow: 0px 0px 5px #00000040;
                }
                #require {
                    font-size: .8rem;
                    font-weight: 800;
                }
	@media screen and (max-width: 650px) {
		#contain {
			max-width: 100%;
			background-color: black;
		}
		#newsform {
			max-width: 100%;
		}
	}
            </style>
            <div id="contain">
                <form id="newsform">
                    <div id="hint" class="cool"></div>
                    <div id="require">Fields with <sup>*</sup> are required.</div>
                    <div class="bind1">
                        <label for="username">Username</label>
                        <input type="text" name="username">
                    </div>
                    <div class="bind1">
                        <label for="email">Email Address <sup>*</sup></label>
                        <input type="text" name="email">
                    </div>
                    <div class="bind1">
                        <label for="password">Password<sup>*</sup></label>
                        <input type="password" name="password">
                    </div>
                    <div class="bind1">
                        <label for="password2">Reenter Password<sup>*</sup></label>
                        <input type="password" name="password2">
                    </div>
                    <div class="bind1">
                        <label>SELECT YOUR TOPICS</label>
                        <div id="topicselector">
                            <div class="bind2">
                                <label for="topic1">Topic 1<sup>*</sup></label>
                                <input type="text" name="topic1">
                            </div>
                            <div class="bind2">
                                <label for="topic2">Topic 2</label>
                                <input type="text" name="topic2">
                            </div>
                            <div class="bind2">
                                <label for="topic3">Topic 3</label>
                                <input type="text" name="topic3">
                            </div>
                            <div class="bind2">
                                <label for="topic4">Topic 4</label>
                                <input type="text" name="topic4">
                            </div>
                            <div class="bind2">
                                <label for="topic5">Topic 5</label>
                                <input type="text" name="topic5">
                            </div>
                            <div class="bind2">
                                <label for="topic6">Topic 6</label>
                                <input type="text" name="topic6">
                            </div>
                            <div class="bind2">
                                <label for="topic7">Topic 7</label>
                                <input type="text" name="topic7">
                            </div>
                            <div class="bind2">
                                <label for="topic8">Topic 8</label>
                                <input type="text" name="topic8">
                            </div>
                            <div class="bind2">
                                <label for="topic9">Topic 9</label>
                                <input type="text" name="topic9">
                            </div>
                            <div class="bind2">
                                <label for="topic10">Topic 10</label>
                                <input type="text" name="topic10">
                            </div>
                        </div>
                    </div>
                    <input name="topics" class="hidden">
                    <div class="bind1">
                        <input id="submitbut" type="submit" value="GET FREE NEWS">
                    </div>
                </form>
            </div>`
        this.hint = this.shadow.getElementById('hint')
        this.init = 'Enter your info and choose your topics to receive your custom news feed for free!'
        this.norm = 'cool'
        this.warn = 'errspan'
        this.on = 0
        this.hint.innerHTML = this.init
        this.shadow.getElementById('newsform').addEventListener('submit', (e) => {
            e.preventDefault()
            e.stopPropagation()
            if (this.on !== 0) {
                return
            }
            this.on = 1
            let form = this.shadow.getElementById('newsform')
            let p = form['password'].value
            let p2 = form['password2'].value                  
            let warn = this.warn
            let hint = this.hint
            let norm = this.norm
            let init = this.init
            if (p != p2) {
                hint.className = 'errspan'
                hint.innerHTML = 'Passwords do not match'
                return this.hintRes()
            }
            if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(p)) {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form['email'].value)){
                    let topics = []
                    Array.from(form.querySelector('#topicselector').querySelectorAll('input')).forEach(input => {
                        if (input.value) topics.push(input.value)
                    })
                    let news = new XMLHttpRequest()
                    news.onerror = (e) => {
                        hint.innerHTML = 'Failed Sign Up, Please Try Again'
                        hint.className = warn
                        return this.hintRes()
                    }
                    news.onreadystatechange = () => {
                        if (news.readyState === 4) {
                            let data = JSON.parse(news.responseText)
                            if (data.error === false) {
                                hint.innerHTML = 'Successful Sign Up. Check Your Email.'
                                form.reset()
                                return this.on = 0
                            } else {
                                hint.className = 'errspan'
                                hint.innerHTML = data.message
                                return this.hintRes()
                            }
                        }
                    }
                    news.open('post', '/signup', true)
                    news.setRequestHeader('Content-Type', 'application/json')
                    let submition = {
                        username: form['username'].value,
                        email: form['email'].value,
                        password: p,
                        topics: topics
                    }
                    news.send(JSON.stringify(submition))
                } else {
                    hint.className = warn
                    hint.innerHTML = 'Please enter a valid email'
                    return this.hintRes()
                }
            } else if (/(?!.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(p)) {
                hint.className = warn
                hint.innerHTML = 'Passwords require one lowercase character'
                return this.hintRes()
            } else if (/(?=.*[a-z])(?!.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(p)) {
                hint.className = warn
                hint.innerHTML = 'Passwords require one uppercase character'
                return this.hintRes()
            } else if (/(?=.*[a-z])(?=.*[A-Z])(?!.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(p)) {
                hint.className = warn
                hint.innerHTML = 'Passwords require one number'
                return this.hintRes()
            } else if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[!@#$%^&*])(?=.{8,})/.test(p)) {
                hint.className = warn
                hint.innerHTML = 'Passwords require one symbol! (!@#$%^&*)'
                return this.hintRes()
            } else if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.{8,})/.test(p)) {
                hint.className = warn
                hint.innerHTML = 'Passwords require at least 8 characters'
                return this.hintRes()
            } else {
                hint.className = warn
                hint.innerHTML = 'Passwords require one symbol (!@#$%^&*), one number, one lowercase letter, one uppercase letter, and must be 8 characters long.'
                return this.hintRes()
            }
        })
    }
}
customElements.define('news-form', News)