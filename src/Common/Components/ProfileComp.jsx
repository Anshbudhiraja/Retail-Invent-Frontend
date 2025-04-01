import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, MapPin, User } from "lucide-react";
import Api from "../../Api/InstanceApi";

const ProfileComp = ({ Token }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!Token) return;
        
        const fetchUser = async () => {
            try {
                const response = await Api.get("/getUser", {
                    headers: { Authorization: Token },
                });
                setUser(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [Token]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 border-4 border-t-[#795ded] border-r-transparent border-b-[#999999] border-l-transparent rounded-full relative"
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <User className="h-6 w-6 text-[#795ded]" />
                </div>
            </motion.div>
        </div>
    );
    if (error) return (
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-500 mt-10 font-medium bg-red-100 p-4 rounded-lg max-w-md mx-auto"
        >
            {error}
        </motion.p>
    );

    const { name, phone, email, address, city, state } = user || {};
 
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="col-span-full lg:col-span-6 w-full pb-20 lg:max-w-[640px] mx-auto"
        >
            <Card className="w-full max-w-3xl mx-auto mt-12 bg-white shadow-2xl hover:shadow-[0_10px_30px_rgba(121,93,237,0.2)] transition-all duration-500 rounded-3xl border border-[#999999]/30 overflow-hidden">
                {/* Header */}
                <CardHeader className=" p-8 flex border-b flex-col sm:flex-row items-center gap-6 text-white rounded-t-3xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffff10_0%,#ffffff00_70%)] pointer-events-none" />
                    <motion.div
                        initial={{ scale: 0.85, rotate: -5 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.7, type: "spring" }}
                    >
                        <Avatar className="h-32 w-32 border-4 border-white/90 shadow-lg relative z-10">
                            <AvatarImage src={'./Images/user/profile-img.png'} alt={name} className="object-cover" />
                            <AvatarFallback className=" text-[#555555] text-2xl font-bold flex items-center justify-center">
                                {name ? name.split(" ").map(n => n[0]).join("") : "NA"}
                            </AvatarFallback>
                        </Avatar>
                    </motion.div>
                    <div className="text-center sm:text-left relative z-10">
                        <CardTitle className="text-4xl text-[#555555] font-extrabold tracking-tight drop-shadow-md">
                            {name || "Unknown User"}
                        </CardTitle>
                        <p className="text-sm text-[#555555] font-medium mt-2  flex items-center justify-center sm:justify-start gap-2">
                            <User className="h-4 w-4" /> Profile Overview
                        </p>
                    </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="p-8 bg-gradient-to-b from-white to-[#f9f9f9]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            className="space-y-5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                        >
                            <div className="group flex items-center gap-4 bg-white p-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-[#999999]/20">
                                <div className="p-3 bg-[#795ded] rounded-full group-hover:rotate-12 transition-transform duration-300">
                                    <Phone className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-[#999999] font-medium tracking-wide">Phone</p>
                                    <p className="text-lg text-[#555555] font-semibold tracking-tight">
                                        {phone || "Not Available"}
                                    </p>
                                </div>
                            </div>
                            <div className="group flex items-center gap-4 bg-white p-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-[#999999]/20">
                                <div className="p-3 bg-[#795ded] rounded-full group-hover:rotate-12 transition-transform duration-300">
                                    <Mail className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[#999999] font-medium tracking-wide">Email</p>
                                    <p className="text-lg text-[#555555] font-semibold tracking-tight overflow-hidden text-ellipsis whitespace-nowrap hover:whitespace-normal hover:text-clip">
                                        {email || "Not Available"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="space-y-5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
                        >
                            <div className="group flex items-start gap-4 bg-white p-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-[#999999]/20">
                                <div className="p-3 bg-[#795ded] rounded-full group-hover:rotate-12 transition-transform duration-300 mt-1">
                                    <MapPin className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-[#999999] font-medium tracking-wide">Address</p>
                                    <p className="text-lg text-[#555555] font-semibold tracking-tight">
                                        {address || "Not Available"}
                                    </p>
                                    <p className="text-md text-[#555555] font-medium mt-1 tracking-tight">
                                        {city && state ? `${city}, ${state}` : "Not Available"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProfileComp;