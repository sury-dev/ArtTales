import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <section className="relative overflow-hidden py-10 bg-black">
            <div className="relative z-10 mx-auto max-w-7xl px-4">
                <div className="-m-6 flex flex-wrap">
                    <div className="w-full p-6 md:w-1/2 lg:w-5/12">
                        <div className="flex h-full flex-col justify-between">
                            <div className="mb-4 inline-flex items-center">
                                {/* <Logo width="100px" /> */}
                                <h1 className='text-white text-4xl'>ART TALES</h1>
                            </div>
                            <div>
                                <p className="text-sm text-white">
                                    &copy; Copyright 2023. All Rights Reserved by DevUI.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                        <div className="h-full">
                            <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-white">
                                Company
                            </h3>
                            <ul>
                                <li className="mb-4 text-base font-medium text-white hover:text-green-400">
                                    Features
                                </li>
                                <li className="mb-4 text-base font-medium text-white hover:text-green-400">
                                    Pricing
                                </li>
                                <li className="mb-4 text-base font-medium text-white hover:text-green-400">
                                    Affiliate Program
                                </li>
                                <li className="text-base font-medium text-white hover:text-green-400">
                                    Press Kit
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                        <div className="h-full">
                            <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-white">
                                Support
                            </h3>
                            <ul>
                                <li className="mb-4 text-base font-medium text-white hover:text-green-400">
                                    Account
                                </li>
                                <li className="mb-4 text-base font-medium text-white hover:text-green-400">
                                    Help
                                </li>
                                <li className="mb-4 text-base font-medium text-white hover:text-green-400">
                                    Contact Us
                                </li>
                                <li className="text-base font-medium text-white hover:text-green-400">
                                    Customer Support
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-3/12">
                        <div className="h-full">
                            <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-white">
                                Legals
                            </h3>
                            <ul>
                                <li className="mb-4 text-base font-medium text-white hover:text-green-400">
                                    Terms &amp; Conditions
                                </li>
                                <li className="mb-4 text-base font-medium text-white hover:text-green-400">
                                    Privacy Policy
                                </li>
                                <li className="text-base font-medium text-white hover:text-green-400">
                                    Licensing
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Footer
